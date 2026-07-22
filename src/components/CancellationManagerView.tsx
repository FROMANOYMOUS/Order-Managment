import React from 'react';
import { Order } from '../types';
import { 
  XCircle, 
  AlertTriangle, 
  CheckCircle2, 
  IndianRupee, 
  HelpCircle, 
  RefreshCw, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CancellationManagerViewProps {
  orders: Order[];
  onProcessCancellation: (order: Order) => void;
  isDarkMode: boolean;
}

export const CancellationManagerView: React.FC<CancellationManagerViewProps> = ({
  orders,
  onProcessCancellation,
  isDarkMode
}) => {
  const cancellationRequests = orders.filter(o => o.cancellationStatus === 'Cancellation Requested');
  const approvedCancellations = orders.filter(o => o.cancellationStatus === 'Cancellation Approved');
  const rejectedCancellations = orders.filter(o => o.cancellationStatus === 'Cancellation Rejected');

  const totalRefundedSum = approvedCancellations.reduce((sum, o) => sum + (o.refundAmount || o.totalAmount), 0);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold flex items-center space-x-2 text-rose-600 dark:text-rose-400">
            <XCircle className="w-5 h-5" />
            <span>Order Cancellation Confirmation Desk</span>
          </h2>
          <p className="text-xs text-slate-500">
            Review customer cancellation requests, confirm refund amounts, and approve or reject order cancellations for Rutuja's Art Collection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            {cancellationRequests.length} Pending Review{cancellationRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50 border-rose-200'
        }`}>
          <div>
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Pending Cancellation Requests
            </p>
            <p className="text-2xl font-bold font-mono text-rose-800 dark:text-rose-300 mt-1">
              {cancellationRequests.length}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Approved Cancellations
            </p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {approvedCancellations.length}
            </p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Refunds Issued (₹)
            </p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
              ₹{totalRefundedSum.toLocaleString('en-IN')}
            </p>
          </div>
          <IndianRupee className="w-8 h-8 text-indigo-500" />
        </div>
      </div>

      {/* Pending Cancellation Requests List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Pending Confirmation Queue ({cancellationRequests.length})</span>
        </h3>

        {cancellationRequests.length === 0 ? (
          <div className={`p-8 text-center rounded-xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Pending Cancellation Requests!</p>
            <p className="text-xs text-slate-500">All artwork orders are in active preparation or transit.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cancellationRequests.map((order) => (
              <div
                key={order.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                  isDarkMode ? 'bg-rose-950/20 border-rose-900/50' : 'bg-rose-50/50 border-rose-200 shadow-sm'
                }`}
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">{order.id}</span>
                    <span className="text-xs text-slate-500">• {order.customer.name} ({order.customer.phone})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase">
                      Needs Action
                    </span>
                  </div>

                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    Artwork: {order.items[0]?.title} (₹{order.totalAmount.toLocaleString('en-IN')})
                  </p>

                  <div className="italic text-xs text-rose-800 dark:text-rose-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded border border-rose-200/60 dark:border-rose-900/40">
                    "{order.cancellationReason || 'Customer submitted cancellation request.'}"
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">
                    Requested At: {order.cancellationRequestedAt || order.orderDate}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => onProcessCancellation(order)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-md animate-pulse"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Confirm / Process Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Cancellation Approvals & Rejections */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Processed Cancellation Audit History
        </h3>

        <div className={`border rounded-xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead className={`text-[11px] font-mono uppercase border-b ${
              isDarkMode ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Refund Amount</th>
                <th className="p-3">Audit Notes</th>
                <th className="p-3">Processed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[...approvedCancellations, ...rejectedCancellations].map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold">{order.id}</td>
                  <td className="p-3 font-semibold">{order.customer.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.cancellationStatus === 'Cancellation Approved'
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {order.cancellationStatus}
                    </span>
                  </td>
                  <td className="p-3 font-bold font-mono">
                    ₹{order.refundAmount ? order.refundAmount.toLocaleString('en-IN') : 0}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {order.cancellationNotes || 'Processed by Admin.'}
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-400">
                    {order.cancellationProcessedAt || order.orderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
