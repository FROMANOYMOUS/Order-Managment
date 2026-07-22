import React, { useState, useEffect } from 'react';
import { Order, SqlDatabaseConfig, SqlQueryLog, DeliveryStatus } from './types';
import { WindowsTitleBar } from './components/WindowsTitleBar';
import { WindowsStatusBar } from './components/WindowsStatusBar';
import { Sidebar, TabType } from './components/Sidebar';
import { OrderList } from './components/OrderList';
import { DeliveryTrackerView } from './components/DeliveryTrackerView';
import { CancellationManagerView } from './components/CancellationManagerView';
import { SqlDbConsoleView } from './components/SqlDbConsoleView';
import { CustomerDirectoryView } from './components/CustomerDirectoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { DeliveryStatusModal } from './components/DeliveryStatusModal';
import { CancellationModal } from './components/CancellationModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { NewOrderModal } from './components/NewOrderModal';
import { PrintInvoiceModal } from './components/PrintInvoiceModal';

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sqlConfig, setSqlConfig] = useState<SqlDatabaseConfig>({
    host: 'mysql://rutuja-art-db.sql.internal',
    port: 3306,
    database: 'rutuja_art_collection_db',
    username: 'rutuja_admin',
    ssl: true,
    connected: true,
    lastSyncTime: new Date().toISOString(),
    activeConnections: 4,
    queryLatencyMs: 12,
    tableCount: 6,
    totalRecordsCount: 0
  });
  const [sqlLogs, setSqlLogs] = useState<SqlQueryLog[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Active Modals State
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [selectedOrderForDeliveryStatus, setSelectedOrderForDeliveryStatus] = useState<Order | null>(null);
  const [selectedOrderForCancellation, setSelectedOrderForCancellation] = useState<Order | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);

  // Fetch initial order dataset & SQL config from backend Express API
  const fetchOrdersAndConfig = async () => {
    setIsSyncing(true);
    try {
      const [ordersRes, configRes, logsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/sql/config'),
        fetch('/api/sql/query-logs')
      ]);

      const ordersData = await ordersRes.json();
      const configData = await configRes.json();
      const logsData = await logsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.orders);
      }
      if (configData.success) {
        setSqlConfig(configData.config);
      }
      if (logsData.success) {
        setSqlLogs(logsData.logs);
      }
    } catch (err) {
      console.error('Failed to fetch orders from API:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndConfig();
  }, []);

  // Update Delivery Status
  const handleSaveDeliveryStatus = async (
    deliveryStatus: DeliveryStatus,
    courierName: string,
    trackingNumber: string,
    estimatedDeliveryDate: string,
    notes: string
  ) => {
    if (!selectedOrderForDeliveryStatus) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrderForDeliveryStatus.id}/delivery-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryStatus,
          courierName,
          trackingNumber,
          estimatedDeliveryDate,
          notes,
          updatedBy: 'Admin (Rutuja V.)'
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
        setSelectedOrderForDeliveryStatus(null);
        fetchOrdersAndConfig();
      }
    } catch (err) {
      console.error('Error updating delivery status:', err);
    }
  };

  // Process Cancellation (Approve or Reject)
  const handleConfirmCancellation = async (
    action: 'APPROVE' | 'REJECT',
    refundAmount: number,
    notes: string
  ) => {
    if (!selectedOrderForCancellation) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrderForCancellation.id}/cancellation-action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, refundAmount, notes })
      });

      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
        setSelectedOrderForCancellation(null);
        fetchOrdersAndConfig();
      }
    } catch (err) {
      console.error('Error confirming cancellation:', err);
    }
  };

  // Create New Order
  const handleCreateNewOrder = async (newOrderPartial: Partial<Order>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPartial)
      });

      const data = await res.json();
      if (data.success) {
        setOrders(prev => [data.order, ...prev]);
        setIsNewOrderModalOpen(false);
        fetchOrdersAndConfig();
      }
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  // Manual SQL Test Connection
  const handleTestSqlConnection = async () => {
    try {
      const res = await fetch('/api/sql/test-connection', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSqlConfig(data.config);
      }
    } catch (err) {
      console.error('SQL connection test error:', err);
    }
  };

  // Execute SQL statement
  const handleExecuteSql = async (sql: string) => {
    try {
      const res = await fetch('/api/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrdersAndConfig();
      }
    } catch (err) {
      console.error('SQL Execution error:', err);
    }
  };

  // Derived counts
  const pendingCancellationsCount = orders.filter(o => o.cancellationStatus === 'Cancellation Requested').length;
  const pendingDeliveriesCount = orders.filter(o => ['Order Placed', 'Processing', 'Framing & Packing', 'Shipped', 'Out for Delivery'].includes(o.deliveryStatus)).length;

  // Filter orders by global search
  const searchedOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      o.items.some(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
    );
  });

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'orders': return 'Orders Master Console';
      case 'delivery': return 'Delivery Status & Logistics Engine';
      case 'cancellations': return 'Cancellation Confirmation Desk';
      case 'customers': return 'Customer Directory & Collector Records';
      case 'sql_db': return 'Connected SQL Database Console';
      case 'analytics': return 'Analytics & Revenue Performance';
      case 'print': return 'Invoice & Dispatch Tag Printer';
      default: return 'Order Handling Console';
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans ${
      isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Windows App Title Bar */}
      <WindowsTitleBar
        sqlConfig={sqlConfig}
        onRefresh={fetchOrdersAndConfig}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSyncing={isSyncing}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTabTitle={getTabTitle(activeTab)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Rail Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCancellationsCount={pendingCancellationsCount}
          pendingDeliveriesCount={pendingDeliveriesCount}
          isDarkMode={isDarkMode}
        />

        {/* Tab Content Display */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white/50 dark:bg-slate-900/40">
          {activeTab === 'orders' && (
            <OrderList
              orders={searchedOrders}
              onViewOrder={(o) => setSelectedOrderForDetail(o)}
              onUpdateDeliveryStatus={(o) => setSelectedOrderForDeliveryStatus(o)}
              onProcessCancellation={(o) => setSelectedOrderForCancellation(o)}
              onPrintInvoice={(o) => setSelectedOrderForPrint(o)}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'delivery' && (
            <DeliveryTrackerView
              orders={orders}
              onUpdateDeliveryStatus={(o) => setSelectedOrderForDeliveryStatus(o)}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'cancellations' && (
            <CancellationManagerView
              orders={orders}
              onProcessCancellation={(o) => setSelectedOrderForCancellation(o)}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerDirectoryView
              orders={orders}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'sql_db' && (
            <SqlDbConsoleView
              sqlConfig={sqlConfig}
              sqlLogs={sqlLogs}
              onTestConnection={handleTestSqlConnection}
              onExecuteSql={handleExecuteSql}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              orders={orders}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'print' && (
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Print Hub</h2>
              <p className="text-xs text-slate-500 mb-4">Select an order from the Orders Master to generate and print official tax invoices and dispatch stickers.</p>
              <OrderList
                orders={searchedOrders}
                onViewOrder={(o) => setSelectedOrderForDetail(o)}
                onUpdateDeliveryStatus={(o) => setSelectedOrderForDeliveryStatus(o)}
                onProcessCancellation={(o) => setSelectedOrderForCancellation(o)}
                onPrintInvoice={(o) => setSelectedOrderForPrint(o)}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </main>
      </div>

      {/* Windows Bottom Status Bar */}
      <WindowsStatusBar
        sqlConfig={sqlConfig}
        totalOrders={orders.length}
        pendingCancellations={pendingCancellationsCount}
        isDarkMode={isDarkMode}
      />

      {/* ================= MODALS OVERLAYS ================= */}

      {/* Order Detail Modal */}
      {selectedOrderForDetail && (
        <OrderDetailModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
          onUpdateDeliveryStatus={() => {
            const o = selectedOrderForDetail;
            setSelectedOrderForDetail(null);
            setSelectedOrderForDeliveryStatus(o);
          }}
          onProcessCancellation={() => {
            const o = selectedOrderForDetail;
            setSelectedOrderForDetail(null);
            setSelectedOrderForCancellation(o);
          }}
          onPrintInvoice={() => {
            const o = selectedOrderForDetail;
            setSelectedOrderForDetail(null);
            setSelectedOrderForPrint(o);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Delivery Status Update Modal */}
      {selectedOrderForDeliveryStatus && (
        <DeliveryStatusModal
          order={selectedOrderForDeliveryStatus}
          onClose={() => setSelectedOrderForDeliveryStatus(null)}
          onSave={handleSaveDeliveryStatus}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {selectedOrderForCancellation && (
        <CancellationModal
          order={selectedOrderForCancellation}
          onClose={() => setSelectedOrderForCancellation(null)}
          onConfirmCancellation={handleConfirmCancellation}
          isDarkMode={isDarkMode}
        />
      )}

      {/* New Order Entry Modal */}
      {isNewOrderModalOpen && (
        <NewOrderModal
          onClose={() => setIsNewOrderModalOpen(false)}
          onSave={handleCreateNewOrder}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Print Invoice Modal */}
      {selectedOrderForPrint && (
        <PrintInvoiceModal
          order={selectedOrderForPrint}
          onClose={() => setSelectedOrderForPrint(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
