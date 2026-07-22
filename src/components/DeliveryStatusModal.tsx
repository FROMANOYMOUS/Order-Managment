import React, { useState } from 'react';
import { Order, DeliveryStatus } from '../types';
import { 
  Truck, 
  X, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  PackageCheck,
  MapPin,
  MessageSquare
} from 'lucide-react';

interface DeliveryStatusModalProps {
  order: Order;
  onClose: () => void;
  onSave: (
    deliveryStatus: DeliveryStatus,
    courierName: string,
    trackingNumber: string,
    estimatedDeliveryDate: string,
    notes: string
  ) => void;
  isDarkMode: boolean;
}

export const DeliveryStatusModal: React.FC<DeliveryStatusModalProps> = ({
  order,
  onClose,
  onSave,
  isDarkMode
}) => {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(order.deliveryStatus);
  const [courierName, setCourierName] = useState<string>(order.courierName || 'Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber || '');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>(
    order.estimatedDeliveryDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [notifyCustomer, setNotifyCustomer] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const deliveryStatuses: DeliveryStatus[] = [
    'Order Placed',
    'Processing',
    'Framing & Packing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(deliveryStatus, courierName, trackingNumber, estimatedDeliveryDate, notes);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-indigo-600 text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Update Delivery Status</h3>
              <p className="text-[11px] text-slate-500 font-mono">Order: {order.id} • {order.customer.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Current Order Summary */}
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="text-slate-500 text-[11px]">Current Status:</span>
              <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                {order.deliveryStatus}
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[11px]">Destination:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-end">
                <MapPin className="w-3 h-3 text-slate-400 inline mr-0.5" />
                {order.customer.city}, {order.customer.pincode}
              </div>
            </div>
          </div>

          {/* New Delivery Status Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Select New Delivery Status:</span>
              <span className="text-[10px] text-indigo-500 font-mono">Syncs instantly to SQL</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {deliveryStatuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setDeliveryStatus(st)}
                  className={`px-3 py-2 rounded-lg border text-left font-medium transition-all ${
                    deliveryStatus === st
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Courier & Tracking details */}
          {['Shipped', 'Out for Delivery', 'Delivered', 'Framing & Packing'].includes(deliveryStatus) && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Courier Service:
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className={`w-full p-2 rounded-lg border font-medium ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Blue Dart Express">Blue Dart Express</option>
                    <option value="Delhivery Surface">Delhivery Surface</option>
                    <option value="DTDC Premium Cargo">DTDC Premium Cargo</option>
                    <option value="India Post SpeedPost">India Post SpeedPost</option>
                    <option value="FedEx India Air">FedEx India Air</option>
                    <option value="Hand Delivery / Local Courier">Hand Delivery / Local Courier</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Tracking / AWB Number:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BD-98210398"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className={`w-full p-2 rounded-lg border font-mono ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Estimated Delivery Date:
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-medium ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Dispatch Notes */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Dispatch Log / Internal Notes:
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Varnish layer complete, double crated with bubble wrap, handed to Blue Dart courier agent..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Notification Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="notifyCustomer"
              checked={notifyCustomer}
              onChange={(e) => setNotifyCustomer(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="notifyCustomer" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              Send automated WhatsApp & Email delivery tracking update to {order.customer.phone}
            </label>
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
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Update & Sync SQL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
