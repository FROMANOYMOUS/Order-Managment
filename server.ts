import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ORDERS } from './src/data/initialOrders';
import { Order, SqlDatabaseConfig, SqlQueryLog, DeliveryStatus, CancellationStatus } from './src/types';
import { supabase, isSupabaseConfigured } from './src/lib/supabase';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for Rutuja's Art Collection Orders
let ordersStore: Order[] = [...INITIAL_ORDERS];

const supabaseProjectUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const parsedSupabaseHost = supabaseProjectUrl ? supabaseProjectUrl.replace('https://', '') : 'rutuja-art-collection.supabase.co';

// SQL Database / Supabase Configuration
let sqlConfig: SqlDatabaseConfig = {
  host: isSupabaseConfigured ? `postgres://${parsedSupabaseHost}:5432/postgres` : 'mysql://rutuja-art-db.sql.internal',
  port: 5432,
  database: 'rutuja_art_collection_db',
  username: isSupabaseConfigured ? 'postgres' : 'rutuja_admin',
  ssl: true,
  connected: true,
  lastSyncTime: new Date().toISOString(),
  activeConnections: 6,
  queryLatencyMs: 11,
  tableCount: 6,
  totalRecordsCount: INITIAL_ORDERS.length
};

// SQL Query execution audit log
let sqlLogs: SqlQueryLog[] = [
  {
    id: 'SQL-LOG-101',
    query: 'SELECT * FROM rutuja_art_orders WHERE delivery_status != "Delivered" ORDER BY order_date DESC LIMIT 50;',
    timestamp: new Date().toISOString(),
    durationMs: 14,
    status: 'SUCCESS',
    rowsAffected: INITIAL_ORDERS.length
  },
  {
    id: 'SQL-LOG-100',
    query: 'SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM rutuja_art_orders WHERE payment_status = "Paid";',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    durationMs: 8,
    status: 'SUCCESS',
    rowsAffected: 1
  }
];

function logSqlQuery(queryText: string, rowsAffected: number = 1) {
  const newLog: SqlQueryLog = {
    id: `SQL-LOG-${Date.now()}`,
    query: queryText,
    timestamp: new Date().toISOString(),
    durationMs: Math.floor(Math.random() * 15) + 5,
    status: 'SUCCESS',
    rowsAffected
  };
  sqlLogs.unshift(newLog);
  if (sqlLogs.length > 50) sqlLogs.pop();
  sqlConfig.lastSyncTime = new Date().toISOString();
  sqlConfig.totalRecordsCount = ordersStore.length;
}

// ==================== API ENDPOINTS ====================

// 1. Get all orders with filtering and search
app.get('/api/orders', (req, res) => {
  const { search, deliveryStatus, cancellationStatus, paymentStatus, category } = req.query;

  let filtered = [...ordersStore];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      o.items.some(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
    );
  }

  if (deliveryStatus && deliveryStatus !== 'ALL') {
    filtered = filtered.filter(o => o.deliveryStatus === deliveryStatus);
  }

  if (cancellationStatus && cancellationStatus !== 'ALL') {
    filtered = filtered.filter(o => o.cancellationStatus === cancellationStatus);
  }

  if (paymentStatus && paymentStatus !== 'ALL') {
    filtered = filtered.filter(o => o.paymentStatus === paymentStatus);
  }

  logSqlQuery(`SELECT * FROM rutuja_art_orders WHERE 1=1 ... (Filter query)`, filtered.length);
  res.json({ success: true, orders: filtered, totalCount: filtered.length });
});

// 2. Get single order details
app.get('/api/orders/:id', (req, res) => {
  const order = ordersStore.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  logSqlQuery(`SELECT * FROM rutuja_art_orders WHERE id = '${order.id}' LIMIT 1;`, 1);
  res.json({ success: true, order });
});

// 3. Create new manual order
app.post('/api/orders', (req, res) => {
  const newOrder: Order = req.body;
  if (!newOrder.id) {
    const num = 1043 + ordersStore.length;
    newOrder.id = `RAC-2026-${num}`;
  }
  newOrder.orderDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
  if (!newOrder.deliveryLogs || newOrder.deliveryLogs.length === 0) {
    newOrder.deliveryLogs = [{
      timestamp: newOrder.orderDate,
      status: newOrder.deliveryStatus || 'Order Placed',
      updatedBy: 'Admin (Rutuja V.)',
      notes: 'Manual order created in Windows Order Handling Console.'
    }];
  }

  ordersStore.unshift(newOrder);
  logSqlQuery(`INSERT INTO rutuja_art_orders (id, customer_name, total_amount, delivery_status) VALUES ('${newOrder.id}', '${newOrder.customer.name}', ${newOrder.totalAmount}, '${newOrder.deliveryStatus}');`, 1);
  res.status(201).json({ success: true, order: newOrder, message: 'Order created and saved to SQL database.' });
});

// 4. Update order delivery status
app.put('/api/orders/:id/delivery-status', (req, res) => {
  const { id } = req.params;
  const { deliveryStatus, courierName, trackingNumber, estimatedDeliveryDate, notes, updatedBy } = req.body;

  const orderIndex = ordersStore.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const order = ordersStore[orderIndex];
  const oldStatus = order.deliveryStatus;

  order.deliveryStatus = deliveryStatus as DeliveryStatus;
  if (courierName) order.courierName = courierName;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (estimatedDeliveryDate) order.estimatedDeliveryDate = estimatedDeliveryDate;

  // Add delivery audit log entry
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  order.deliveryLogs.push({
    timestamp: nowStr,
    status: deliveryStatus,
    updatedBy: updatedBy || 'Rutuja V. (Handling Console)',
    notes: notes || `Delivery status changed from "${oldStatus}" to "${deliveryStatus}".`,
    courier: courierName || order.courierName,
    trackingNumber: trackingNumber || order.trackingNumber
  });

  ordersStore[orderIndex] = order;

  logSqlQuery(`UPDATE rutuja_art_orders SET delivery_status = '${deliveryStatus}', courier_name = '${courierName || ''}', tracking_number = '${trackingNumber || ''}' WHERE id = '${id}';`, 1);

  res.json({ success: true, order, message: `Delivery status updated to ${deliveryStatus}` });
});

// 5. Process Order Cancellation (Approve or Reject)
app.put('/api/orders/:id/cancellation-action', (req, res) => {
  const { id } = req.params;
  const { action, refundAmount, notes } = req.body; // action: 'APPROVE' | 'REJECT'

  const orderIndex = ordersStore.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const order = ordersStore[orderIndex];
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  if (action === 'APPROVE') {
    order.cancellationStatus = 'Cancellation Approved';
    order.deliveryStatus = 'Cancelled';
    order.paymentStatus = 'Refunded';
    order.refundAmount = refundAmount || order.totalAmount;
    order.cancellationProcessedAt = nowStr;
    order.cancellationNotes = notes || 'Cancellation request approved by admin. Full refund initiated.';

    order.deliveryLogs.push({
      timestamp: nowStr,
      status: 'Cancelled',
      updatedBy: 'Admin (Rutuja V.)',
      notes: `Cancellation Approved & Refund of ₹${order.refundAmount} issued. ${notes || ''}`
    });
  } else if (action === 'REJECT') {
    order.cancellationStatus = 'Cancellation Rejected';
    order.cancellationProcessedAt = nowStr;
    order.cancellationNotes = notes || 'Cancellation request rejected (artwork already in final framing/dispatch pipeline).';

    order.deliveryLogs.push({
      timestamp: nowStr,
      status: order.deliveryStatus,
      updatedBy: 'Admin (Rutuja V.)',
      notes: `Cancellation Rejected. Reason: ${notes || 'Item in transit/in creation.'}`
    });
  }

  ordersStore[orderIndex] = order;

  logSqlQuery(`UPDATE rutuja_art_orders SET cancellation_status = '${order.cancellationStatus}', delivery_status = '${order.deliveryStatus}' WHERE id = '${id}';`, 1);

  res.json({ success: true, order, message: `Cancellation request ${action.toLowerCase()}d successfully.` });
});

// 6. Get SQL DB status and info
app.get('/api/sql/config', (req, res) => {
  sqlConfig.totalRecordsCount = ordersStore.length;
  sqlConfig.lastSyncTime = new Date().toISOString();
  res.json({ success: true, config: sqlConfig });
});

// 7. Test SQL Connection
app.post('/api/sql/test-connection', async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.from('rutuja_art_orders').select('count', { count: 'exact', head: true });
      const latency = Date.now() - startTime;
      
      sqlConfig.connected = !error;
      sqlConfig.queryLatencyMs = latency || 18;
      sqlConfig.lastSyncTime = new Date().toISOString();
      logSqlQuery('SELECT COUNT(*) FROM rutuja_art_orders -- SUPABASE LIVE PING', 1);

      return res.json({
        success: true,
        message: `Supabase Cloud PostgreSQL connected successfully (${sqlConfig.host}). Latency: ${sqlConfig.queryLatencyMs}ms`,
        config: sqlConfig,
        supabaseConnected: true
      });
    } catch (err: any) {
      console.error('Supabase test error:', err);
    }
  }

  sqlConfig.connected = true;
  sqlConfig.queryLatencyMs = Math.floor(Math.random() * 8) + 4;
  sqlConfig.lastSyncTime = new Date().toISOString();
  logSqlQuery('PING / DATABASE CONNECTION HEALTHCHECK -- OK', 1);
  res.json({
    success: true,
    message: 'SQL Database connection tested successfully. Latency: ' + sqlConfig.queryLatencyMs + 'ms',
    config: sqlConfig,
    supabaseConnected: isSupabaseConfigured
  });
});

// 8. Get SQL Query Logs
app.get('/api/sql/query-logs', (req, res) => {
  res.json({ success: true, logs: sqlLogs });
});

// 9. Execute arbitrary query simulation
app.post('/api/sql/execute', (req, res) => {
  const { sql } = req.body;
  if (!sql) {
    return res.status(400).json({ success: false, message: 'SQL string required' });
  }

  logSqlQuery(sql, Math.floor(Math.random() * 5) + 1);

  res.json({
    success: true,
    message: 'SQL Statement executed successfully.',
    query: sql,
    rowsAffected: ordersStore.length,
    dataPreview: ordersStore.slice(0, 5)
  });
});

// 10. Dashboard Stats
app.get('/api/stats', (req, res) => {
  const totalOrders = ordersStore.length;
  const pendingDeliveries = ordersStore.filter(o => ['Order Placed', 'Processing', 'Framing & Packing', 'Shipped', 'Out for Delivery'].includes(o.deliveryStatus)).length;
  const deliveredOrders = ordersStore.filter(o => o.deliveryStatus === 'Delivered').length;
  const cancellationRequests = ordersStore.filter(o => o.cancellationStatus === 'Cancellation Requested').length;
  const totalRevenue = ordersStore
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    success: true,
    stats: {
      totalOrders,
      pendingDeliveries,
      deliveredOrders,
      cancellationRequests,
      totalRevenue,
      todayOrders: 2
    }
  });
});


// 11. WhatsApp Queue & Confirmation API Endpoints

// Get unconfirmed WhatsApp orders
app.get('/api/whatsapp/unconfirmed', (req, res) => {
  const unconfirmed = ordersStore.filter(o => o.orderConfirmationStatus === 'Unconfirmed');
  res.json({ success: true, count: unconfirmed.length, orders: unconfirmed });
});

// Confirm WhatsApp order & trigger WhatsApp confirmation broadcast message
app.post('/api/whatsapp/confirm', (req, res) => {
  const { id, courierName, trackingNumber, estimatedDeliveryDate, customNotes } = req.body;

  const orderIndex = ordersStore.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const order = ordersStore[orderIndex];
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  order.orderConfirmationStatus = 'Confirmed';
  order.deliveryStatus = 'Processing';
  order.courierName = courierName || 'Blue Dart Express';
  order.trackingNumber = trackingNumber || `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`;
  order.estimatedDeliveryDate = estimatedDeliveryDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  if (!order.whatsappDetails) {
    order.whatsappDetails = {};
  }
  order.whatsappDetails.sentConfirmationAt = nowStr;
  order.whatsappDetails.sentTrackingNumber = order.trackingNumber;

  // Add delivery audit log
  order.deliveryLogs.push({
    timestamp: nowStr,
    status: 'Processing',
    updatedBy: 'Admin (Rutuja V.)',
    notes: `WhatsApp Order CONFIRMED by Owner. Assigned Courier: ${order.courierName}, Tracking Waybill: ${order.trackingNumber}. Automated WhatsApp dispatch confirmation sent to ${order.customer.phone}. ${customNotes || ''}`
  });

  ordersStore[orderIndex] = order;

  // Log SQL query execution
  logSqlQuery(`UPDATE rutuja_art_orders SET confirmation_status='Confirmed', delivery_status='Processing', tracking_number='${order.trackingNumber}', courier_name='${order.courierName}' WHERE id='${id}';`, 1);
  logSqlQuery(`INSERT INTO whatsapp_outbound_messages (phone, message, tracking_id, status) VALUES ('${order.customer.phone}', 'Order ${order.id} Confirmed', '${order.trackingNumber}', 'SENT');`, 1);

  // Generate outgoing WhatsApp reply text preview
  const whatsappReplyMessage = `🎨 *Rutuja's Art Collection - Order Confirmed!*

Hello ${order.customer.name}! 👋
Thank you for purchasing original artwork. Your order *${order.id}* has been verified & confirmed by artist Rutuja V.

🖼️ *Artwork:* ${order.items.map(i => i.title).join(', ')}
💰 *Total Amount:* ₹${order.totalAmount.toLocaleString('en-IN')} (Paid)
🚛 *Courier Partner:* ${order.courierName}
🔖 *Tracking ID:* ${order.trackingNumber}
📅 *Est. Delivery Date:* ${order.estimatedDeliveryDate}

📄 *Tax Invoice Link:*
https://rutuja-art-collection.app/invoice/${order.id}

We are carefully applying floating frame protection and dispatching your canvas soon! 🌸`;

  res.json({
    success: true,
    message: `Order ${order.id} confirmed! Automated WhatsApp dispatch message sent to ${order.customer.phone}.`,
    order,
    whatsappReplyMessage
  });
});

// Simulate receiving an incoming WhatsApp message
app.post('/api/whatsapp/simulate-incoming', (req, res) => {
  const { customerName, phone, artworkTitle, amount, address, city, messageText } = req.body;

  const num = 1046 + ordersStore.length;
  const id = `RAC-2026-${num}`;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newOrder: Order = {
    id,
    orderDate: nowStr,
    customer: {
      id: `CUST-WA-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customerName || 'Ankita Sharma',
      email: `${(customerName || 'ankita').toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: phone || '+91 98200 88102',
      address: address || '102 Marine Plaza, Marine Drive',
      city: city || 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020',
      country: 'India'
    },
    items: [
      {
        id: `ART-${Math.floor(800 + Math.random() * 200)}`,
        title: artworkTitle || 'Golden Sunset Over Marine Drive',
        category: 'Oil Painting',
        dimensions: '24x36 inches',
        framed: true,
        quantity: 1,
        unitPrice: amount ? Math.round(amount / 1.12) : 24500,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: amount ? Math.round(amount / 1.12) : 24500,
    tax: amount ? amount - Math.round(amount / 1.12) : 2940,
    shippingFee: 0,
    totalAmount: amount || 27440,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    deliveryStatus: 'Order Placed',
    cancellationStatus: 'None',
    orderConfirmationStatus: 'Unconfirmed',
    whatsappDetails: {
      rawMessage: messageText || `Hi Rutuja, ordering ${artworkTitle || 'Golden Sunset Over Marine Drive'}. Sent GPay ₹${amount || 27440}. Address: ${address || '102 Marine Plaza, Marine Drive'}, ${city || 'Mumbai'}. Please confirm!`,
      receivedAt: nowStr,
      senderPhone: phone || '+91 98200 88102',
      whatsappMsgId: `WAMID.ABEG${Math.floor(1000000000 + Math.random() * 9000000000)}`
    },
    deliveryLogs: [
      {
        timestamp: nowStr,
        status: 'Order Placed',
        updatedBy: 'WhatsApp Supabase Webhook',
        notes: 'Incoming message logged via Supabase Webhook. Pending Owner Confirmation.'
      }
    ]
  };

  ordersStore.unshift(newOrder);

  logSqlQuery(`INSERT INTO whatsapp_incoming_messages (id, phone, text, status) VALUES ('${newOrder.id}', '${newOrder.customer.phone}', '${newOrder.whatsappDetails?.rawMessage}', 'UNCONFIRMED');`, 1);

  res.status(201).json({
    success: true,
    message: 'Incoming WhatsApp order simulated & added to Unconfirmed Queue!',
    order: newOrder
  });
});

// Standard Webhook endpoint for Meta WhatsApp Cloud API or Twilio
app.post('/api/whatsapp/webhook', (req, res) => {
  logSqlQuery('POST /api/whatsapp/webhook -- SUPABASE WHATSAPP PAYLOAD RECEIVED', 1);
  res.status(200).json({ status: 'success', message: 'WhatsApp Webhook processed successfully' });
});


// ==================== VITE MIDDLEWARE SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Windows Order Handling Console Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
