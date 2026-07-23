export type DeliveryStatus = 
  | 'Order Placed'
  | 'Processing'
  | 'Framing & Packing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type CancellationStatus = 
  | 'None'
  | 'Cancellation Requested'
  | 'Cancellation Approved'
  | 'Cancellation Rejected';

export type ArtCategory = 
  | 'Oil Painting'
  | 'Acrylic Canvas'
  | 'Charcoal Sketch'
  | 'Resin Art'
  | 'Watercolour'
  | 'Custom Commission';

export interface OrderItem {
  id: string;
  title: string;
  category: ArtCategory;
  dimensions: string; // e.g. "24x36 inches"
  framed: boolean;
  quantity: number;
  unitPrice: number; // In INR ₹
  image: string;
  artistNote?: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  totalOrdersCount?: number;
}

export interface DeliveryLog {
  timestamp: string;
  status: DeliveryStatus;
  updatedBy: string;
  notes: string;
  courier?: string;
  trackingNumber?: string;
}

export interface Order {
  id: string; // e.g. "RAC-2026-1089"
  orderDate: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number; // ₹
  paymentMethod: 'UPI / GPay' | 'Credit Card' | 'NetBanking' | 'Cash on Delivery' | 'PayPal';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Partially Refunded';
  deliveryStatus: DeliveryStatus;
  courierName?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  
  // Cancellation details
  cancellationStatus: CancellationStatus;
  cancellationReason?: string;
  cancellationRequestedAt?: string;
  cancellationProcessedAt?: string;
  cancellationNotes?: string;
  refundAmount?: number;
  
  deliveryLogs: DeliveryLog[];
  specialInstructions?: string;
  isUrgent?: boolean;

  // WhatsApp & Unconfirmed Order attributes
  orderConfirmationStatus?: 'Unconfirmed' | 'Confirmed';
  whatsappDetails?: {
    rawMessage?: string;
    receivedAt?: string;
    senderPhone?: string;
    whatsappMsgId?: string;
    sentConfirmationAt?: string;
    sentTrackingNumber?: string;
  };
}

export interface SqlDatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  ssl: boolean;
  connected: boolean;
  lastSyncTime: string;
  activeConnections: number;
  queryLatencyMs: number;
  tableCount: number;
  totalRecordsCount: number;
}

export interface SqlQueryLog {
  id: string;
  query: string;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'ERROR';
  rowsAffected: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingDeliveries: number;
  deliveredOrders: number;
  cancellationRequests: number;
  totalRevenue: number;
  todayOrders: number;
}
