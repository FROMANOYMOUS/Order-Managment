import React, { useState } from 'react';
import { Order } from '../types';
import { MessageSquare, CheckCircle, Truck, Package, X, Send, Sparkles, ExternalLink } from 'lucide-react';

interface ConfirmWhatsAppOrderModalProps {
  order: Order;
  onClose: () => void;
  onConfirmOrder: (orderId: string, courierName: string, trackingNumber: string, estimatedDeliveryDate: string, customNotes: string) => void;
  isDarkMode: boolean;
}

export const ConfirmWhatsAppOrderModal: React.FC<ConfirmWhatsAppOrderModalProps> = ({
  order,
  onClose,
  onConfirmOrder,
  isDarkMode
}) => {
  const [courierName, setCourierName] = useState<string>(order.courierName || 'Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState<string>(
    order.trackingNumber || `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`
  );
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>(
    order.estimatedDeliveryDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [customNotes, setCustomNotes] = useState<string>('Painting is in final varnish inspection and wooden crate packing.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const whatsappFormattedMessage = `🎨 *Rutuja's Art Collection - Order Confirmed!*

Hello ${order.customer.name}! 👋
Thank you for purchasing original artwork. Your order *${order.id}* has been verified & confirmed by artist Rutuja V.

🖼️ *Artwork:* ${order.items.map(i => i.title).join(', ')}
💰 *Amount Paid:* ₹${order.totalAmount.toLocaleString('en-IN')} (UPI / Verified)
🚛 *Courier Partner:* ${courierName}
🔖 *Tracking ID:* ${trackingNumber}
📅 *Est. Delivery Date:* ${estimatedDeliveryDate}

📄 *Tax Invoice Link:*
https://rutuja-art-collection.app/invoice/${order.id}

We are carefully applying floating frame protection and dispatching your canvas soon! 🌸`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmOrder(order.id, courierName, trackingNumber, estimatedDeliveryDate, customNotes);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-3xl rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-all max-h-[92vh] ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
              <MessageSquare className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center space-x-2">
                <span>Confirm WhatsApp Order & Dispatch Tracking</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-400/30 text-emerald-100 border border-emerald-300/40">
                  {order.id}
                </span>
              </h2>
              <p className="text-[11px] text-emerald-100/90">
                Incoming WhatsApp Inquiry from <strong>{order.customer.name}</strong> ({order.customer.phone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Customer & Incoming Raw Message snippet */}
          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-emerald-50/60 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Received WhatsApp Message Payload</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Received: {order.whatsappDetails?.receivedAt || order.orderDate}
              </span>
            </div>
            <p className="p-2.5 rounded bg-white dark:bg-slate-950 font-mono text-[11px] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              "{order.whatsappDetails?.rawMessage || `Ordering ${order.items[0]?.title}. Phone: ${order.customer.phone}`}"
            </p>
          </div>

          <form id="confirm-order-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Courier & Tracking setup */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Assign Logistics & Tracking ID</span>
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Courier Partner Name
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Premium Cargo">DTDC Premium Cargo</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                  <option value="Xpressbees Logistics">Xpressbees Logistics</option>
                  <option value="Hand Delivery / Studio Pickup">Hand Delivery / Studio Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Assigned Tracking Waybill ID
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-89201920IN"
                  required
                  className={`w-full p-2 rounded-lg border font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  required
                  className={`w-full p-2 rounded-lg border text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Owner Internal Dispatch Note
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Notes on packaging, varnish drying..."
                  className={`w-full p-2 rounded-lg border text-xs focus:ring-2 focus:ring-emerald-500 outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Right Column: Live WhatsApp Message Chat Box Preview */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                <Send className="w-3.5 h-3.5 text-emerald-500" />
                <span>Live Outgoing WhatsApp Message Preview</span>
              </h3>

              {/* Mock WhatsApp Chat Card */}
              <div className="rounded-xl border border-emerald-500/30 overflow-hidden shadow-lg bg-[#0b141a] text-white">
                {/* WhatsApp Chat Header */}
                <div className="p-2.5 bg-[#202c33] flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white leading-tight">{order.customer.name}</p>
                      <p className="text-[9px] text-emerald-400">WhatsApp Business • Automated Reply</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{order.customer.phone}</span>
                </div>

                {/* Chat Bubble Area */}
                <div className="p-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:12px_12px] bg-[#0b141a] max-h-56 overflow-y-auto space-y-2">
                  {/* Incoming bubble */}
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] p-2 rounded-lg max-w-[85%] text-[10px] text-slate-200">
                      {order.whatsappDetails?.rawMessage || 'Inquiring for painting purchase.'}
                    </div>
                  </div>

                  {/* Outgoing bubble */}
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] p-2.5 rounded-lg max-w-[90%] text-[10px] text-slate-100 whitespace-pre-wrap leading-relaxed shadow-sm">
                      {whatsappFormattedMessage}
                      <div className="text-[8px] text-emerald-200 text-right mt-1 font-mono">
                        Just now ✓✓
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Clicking confirm triggers the WhatsApp API notification & updates Supabase.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="confirm-order-form"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Confirming...' : 'Confirm Order & Send WhatsApp Alert'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
