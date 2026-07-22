import React, { useState } from 'react';
import { 
  Order, 
  DeliveryStatus, 
  CancellationStatus 
} from '../types';
import { 
  Eye, 
  Truck, 
  XCircle, 
  Printer, 
  Filter, 
  CheckSquare, 
  Square, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  ArrowUpDown,
  Search,
  IndianRupee,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateDeliveryStatus: (order: Order) => void;
  onProcessCancellation: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  isDarkMode: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  onUpdateDeliveryStatus,
  onProcessCancellation,
  onPrintInvoice,
  isDarkMode
}) => {
  const [selectedDeliveryStatusFilter, setSelectedDeliveryStatusFilter] = useState<string>('ALL');
  const [selectedCancellationFilter, setSelectedCancellationFilter] = useState<string>('ALL');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('ALL');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'orderDate' | 'totalAmount' | 'id'>('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (selectedDeliveryStatusFilter !== 'ALL' && order.deliveryStatus !== selectedDeliveryStatusFilter) {
      return false;
    }
    if (selectedCancellationFilter !== 'ALL' && order.cancellationStatus !== selectedCancellationFilter) {
      return false;
    }
    if (selectedPaymentFilter !== 'ALL' && order.paymentStatus !== selectedPaymentFilter) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortField === 'totalAmount') {
      return sortOrder === 'desc' ? b.totalAmount - a.totalAmount : a.totalAmount - b.totalAmount;
    } else if (sortField === 'id') {
      return sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
    } else {
      return sortOrder === 'desc' 
        ? new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        : new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    }
  });

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const getDeliveryBadgeClass = (status: DeliveryStatus) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Processing':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Framing & Packing':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Shipped':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Out for Delivery':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 font-semibold animate-pulse';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Filter Bar */}
      <div className={`p-3 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Delivery Status Filter */}
          <select
            value={selectedDeliveryStatusFilter}
            onChange={(e) => setSelectedDeliveryStatusFilter(e.target.value)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium outline-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Processing">Processing</option>
            <option value="Framing & Packing">Framing & Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Cancellation Filter */}
          <select
            value={selectedCancellationFilter}
            onChange={(e) => setSelectedCancellationFilter(e.target.value)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium outline-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Cancellation Statuses</option>
            <option value="Cancellation Requested">⚠️ Requested by Customer</option>
            <option value="Cancellation Approved">Approved & Refunded</option>
            <option value="Cancellation Rejected">Rejected & In Transit</option>
            <option value="None">No Cancellation Request</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedPaymentFilter}
            onChange={(e) => setSelectedPaymentFilter(e.target.value)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium outline-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending Payment</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center space-x-2 text-slate-500">
          <span className="text-[11px]">Sort By:</span>
          <button
            onClick={() => {
              if (sortField === 'orderDate') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              else { setSortField('orderDate'); setSortOrder('desc'); }
            }}
            className={`px-2 py-0.5 rounded border text-[11px] font-medium flex items-center space-x-1 ${
              sortField === 'orderDate' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent'
            }`}
          >
            <span>Date</span>
            <ArrowUpDown className="w-3 h-3 inline" />
          </button>
          <button
            onClick={() => {
              if (sortField === 'totalAmount') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              else { setSortField('totalAmount'); setSortOrder('desc'); }
            }}
            className={`px-2 py-0.5 rounded border text-[11px] font-medium flex items-center space-x-1 ${
              sortField === 'totalAmount' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent'
            }`}
          >
            <span>Amount</span>
            <ArrowUpDown className="w-3 h-3 inline" />
          </button>
        </div>
      </div>

      {/* Orders Table Area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className={`sticky top-0 text-[11px] font-mono uppercase tracking-wider border-b select-none transition-colors z-10 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}>
            <tr>
              <th className="p-3 w-10">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                  {selectedOrders.length > 0 && selectedOrders.length === filteredOrders.length ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3 font-semibold">Order ID & Date</th>
              <th className="p-3 font-semibold">Customer Details</th>
              <th className="p-3 font-semibold">Artwork Items</th>
              <th className="p-3 font-semibold">Amount & Payment</th>
              <th className="p-3 font-semibold">Delivery Status</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="w-8 h-8 text-slate-400" />
                    <p className="font-semibold text-sm">No orders matching your filter criteria.</p>
                    <p className="text-xs text-slate-400">Try clearing filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id);
                const isCancellationRequested = order.cancellationStatus === 'Cancellation Requested';

                return (
                  <tr 
                    key={order.id}
                    className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                      isCancellationRequested ? 'bg-rose-500/5 dark:bg-rose-500/10' : ''
                    } ${
                      isSelected ? 'bg-indigo-50/60 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      <button onClick={() => toggleSelectOrder(order.id)} className="text-slate-400 hover:text-indigo-600">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Order ID & Date */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        <span>{order.id}</span>
                        {order.isUrgent && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-rose-500 text-white font-sans uppercase font-bold">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400 inline" />
                        <span>{order.orderDate}</span>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {order.customer.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-0.5 text-slate-400" />
                          {order.customer.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                          {order.customer.city}, {order.customer.state}
                        </span>
                      </div>
                    </td>

                    {/* Artwork Items preview */}
                    <td className="p-3">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-7 h-7 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                            />
                            <div className="truncate max-w-[200px]">
                              <span className="font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {item.category} ({item.dimensions}) {item.framed ? '• Framed' : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          order.paymentStatus === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : order.paymentStatus === 'Refunded'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-slate-400 font-mono">({order.paymentMethod})</span>
                      </div>
                    </td>

                    {/* Delivery Status & Cancellation Tag */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getDeliveryBadgeClass(order.deliveryStatus)}`}>
                          <Truck className="w-3 h-3 mr-1" />
                          {order.deliveryStatus}
                        </span>

                        {/* Cancellation Request Warning Badge */}
                        {isCancellationRequested && (
                          <div className="flex items-center space-x-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3 animate-pulse text-rose-500" />
                            <span>Cancellation Requested</span>
                          </div>
                        )}

                        {order.trackingNumber && (
                          <div className="text-[10px] font-mono text-slate-500">
                            AWB: {order.trackingNumber} ({order.courierName})
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Quick Action Buttons */}
                    <td className="p-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* View Modal */}
                        <button
                          onClick={() => onViewOrder(order)}
                          title="View Full Order Details"
                          className="p-1.5 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Update Delivery Status Modal */}
                        <button
                          onClick={() => onUpdateDeliveryStatus(order)}
                          title="Update Delivery Status & Courier"
                          className="p-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] flex items-center space-x-1 transition-colors shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">Status</span>
                        </button>

                        {/* Cancellation Action button */}
                        {isCancellationRequested ? (
                          <button
                            onClick={() => onProcessCancellation(order)}
                            title="Process Cancellation Request"
                            className="p-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] flex items-center space-x-1 animate-pulse"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Review Cancellation</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onPrintInvoice(order)}
                            title="Print Invoice / Delivery Tag"
                            className="p-1.5 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
