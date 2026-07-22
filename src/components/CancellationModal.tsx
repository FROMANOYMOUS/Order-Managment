import React, { useState } from 'react';
import { Order } from '../types';
import { 
  XCircle, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  IndianRupee, 
  RefreshCw, 
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

interface CancellationModalProps {
  order: Order;
  onClose: () => void;
  onConfirmCancellation: (action: 'APPROVE' | 'REJECT', refundAmount: number, notes: string) => void;
  isDarkMode: boolean;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  order,
  onClose,
  onConfirmCancellation,
  isDarkMode
}) => {
  const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [refundAmount, setRefundAmount] = useState<number>(order.totalAmount);
  const [restockInventory, setRestockInventory] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>(
    action === 'APPROVE'
      ? 'Cancellation request approved. Full refund processed to original payment method.'
      : 'Cancellation request declined. Artwork is already framed and handed over to courier dispatch.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancellation(action, refundAmount, notes);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-rose-950/40 border-rose-900/50' : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-rose-600 text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400">Order Cancellation Confirmation Desk</h3>
              <p className="text-[11px] text-slate-500 font-mono">Order: {order.id} • {order.customer.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Customer Cancellation Request Info Box */}
          <div className={`p-3 rounded-lg border space-y-1.5 ${
            isDarkMode ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50/60 border-rose-200'
          }`}>
            <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 font-semibold">
              <span className="flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Customer Cancellation Reason:
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Requested: {order.cancellationRequestedAt || 'Recently'}
              </span>
            </div>
            <p className="italic text-slate-800 dark:text-slate-200 bg-white/50 dark:bg-slate-800/50 p-2 rounded border border-rose-200/50 dark:border-rose-900/30">
              "{order.cancellationReason || 'Customer requested to cancel order prior to delivery.'}"
            </p>
          </div>

          {/* Action Choice Tabs: Approve vs Reject */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Select Confirmation Decision:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAction('APPROVE');
                  setNotes('Cancellation request approved. Full refund processed to original payment method.');
                }}
                className={`p-2.5 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-all ${
                  action === 'APPROVE'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Cancellation</span>
                <span className="text-[10px] font-normal opacity-80">Cancel Order & Issue Refund</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAction('REJECT');
                  setNotes('Cancellation request declined. Artwork is already framed and handed over to courier dispatch.');
                }}
                className={`p-2.5 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-all ${
                  action === 'REJECT'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Cancellation</span>
                <span className="text-[10px] font-normal opacity-80">Keep Order Active & In Dispatch</span>
              </button>
            </div>
          </div>

          {/* Refund Amount Configuration (If approving) */}
          {action === 'APPROVE' && (
            <div className="space-y-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Refund Amount (₹ INR):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className={`w-full pl-7 pr-3 py-1.5 rounded-md border font-bold text-sm ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Total Paid by Customer: ₹{order.totalAmount.toLocaleString('en-IN')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restock"
                  checked={restockInventory}
                  onChange={(e) => setRestockInventory(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="restock" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  Restock artwork item back to Rutuja's Art Gallery SQL inventory database
                </label>
              </div>
            </div>
          )}

          {/* Reply Notes / Confirmation Message to Customer */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Confirmation Notes / Reason to Customer:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg border font-medium ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-1.5 rounded-lg font-bold text-white flex items-center space-x-1.5 shadow-md transition-all ${
                action === 'APPROVE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {action === 'APPROVE' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Cancellation & Issue Refund</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Decline Request & Proceed Shipment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
