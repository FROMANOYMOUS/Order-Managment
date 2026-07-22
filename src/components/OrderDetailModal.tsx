import React from 'react';
import { Order } from '../types';
import { 
  X, 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Truck, 
  Clock, 
  Palette, 
  Printer, 
  FileCheck, 
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateDeliveryStatus: () => void;
  onProcessCancellation: () => void;
  onPrintInvoice: () => void;
  isDarkMode: boolean;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateDeliveryStatus,
  onProcessCancellation,
  onPrintInvoice,
  isDarkMode
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-3xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Window Titlebar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between select-none ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-bold text-xs">
              RAC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm">Order Record #{order.id}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${
                  order.deliveryStatus === 'Delivered' 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                    : order.deliveryStatus === 'Cancelled'
                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                }`}>
                  {order.deliveryStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Order Date: {order.orderDate} • SQL Record Verified</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onPrintInvoice}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium flex items-center space-x-1 ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-300 shadow-sm'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Invoice</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Window Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Cancellation Alert Banner if applicable */}
          {order.cancellationStatus === 'Cancellation Requested' && (
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse shrink-0" />
                <div>
                  <p className="font-bold">Cancellation Requested by Customer</p>
                  <p className="text-[11px] opacity-90">Reason: "{order.cancellationReason}"</p>
                </div>
              </div>
              <button
                onClick={onProcessCancellation}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs shrink-0"
              >
                Review Request
              </button>
            </div>
          )}

          {/* Grid Layout: Customer Info & Payment/Courier Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer & Delivery Address Card */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-700">
                <User className="w-4 h-4 text-indigo-500" />
                <span>Customer Details & Address</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{order.customer.name}</p>
                <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{order.customer.phone}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-start space-x-1 text-slate-600 dark:text-slate-300 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}, {order.customer.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Logistics Status Card */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-700">
                <CreditCard className="w-4 h-4 text-indigo-500" />
                <span>Payment & Shipping Information</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    order.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {order.paymentStatus} ({order.paymentMethod})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Courier Service:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{order.courierName || 'Not Assigned'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tracking AWB #:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {order.trackingNumber || 'Pending Dispatch'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{order.estimatedDeliveryDate || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Artwork Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                <Palette className="w-4 h-4 text-rose-500" />
                <span>Artwork Items in Order ({order.items.length})</span>
              </h4>
            </div>

            <div className="border rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex items-start space-x-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.title}</p>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono">
                        {item.category}
                      </span>
                      <span>• Size: {item.dimensions}</span>
                      <span>• {item.framed ? 'Teakwood/Glass Frame Installed' : 'Unframed Canvas Roll'}</span>
                      <span>• Qty: {item.quantity}</span>
                    </div>

                    {item.artistNote && (
                      <p className="text-[11px] italic text-slate-500 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 text-amber-800 dark:text-amber-300">
                        Artist Note: "{item.artistNote}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price Calculation Summary */}
          <div className={`p-3 rounded-xl border flex flex-col items-end space-y-1 text-right ${
            isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST Tax (12%):</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Insured Freight & Packaging:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 border-t pt-1 border-slate-300 dark:border-slate-700">
                <span>Total Amount Paid:</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Timeline Audit Logs */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Delivery Timeline & Audit History ({order.deliveryLogs.length} events)</span>
            </h4>

            <div className={`p-3 rounded-xl border space-y-3 ${
              isDarkMode ? 'bg-slate-800/20 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              {order.deliveryLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 shrink-0"></div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-900 dark:text-slate-100">{log.status}</span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{log.notes}</p>
                    <p className="text-[10px] text-slate-400">Updated by: {log.updatedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Window Footer */}
        <div className={`px-4 py-3 border-t flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>SQL ID: rutuja_art_orders.{order.id}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onUpdateDeliveryStatus}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs flex items-center space-x-1 shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Update Delivery Status</span>
            </button>
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg border font-medium text-xs ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
