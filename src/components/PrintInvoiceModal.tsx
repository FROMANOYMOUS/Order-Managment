import React from 'react';
import { Order } from '../types';
import { Printer, X, Palette, CheckCircle2 } from 'lucide-react';

interface PrintInvoiceModalProps {
  order: Order;
  onClose: () => void;
  isDarkMode: boolean;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, onClose, isDarkMode }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="p-3 border-b flex items-center justify-between bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-xs">Print Order Invoice & Shipping Manifest Tag</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-xs flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 space-y-6 text-xs bg-white text-slate-900 overflow-y-auto max-h-[80vh]">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center space-x-2 font-bold text-lg text-slate-900">
                <Palette className="w-5 h-5 text-rose-600" />
                <span>Rutuja's Art Collection</span>
              </div>
              <p className="text-[10px] text-slate-600">Original Artwork Studio & Fine Art Gallery</p>
              <p className="text-[10px] text-slate-600">Mumbai, Maharashtra, India | Contact: +91 98200 00000</p>
            </div>

            <div className="text-right font-mono">
              <h2 className="text-sm font-bold uppercase tracking-wider">Tax Invoice</h2>
              <p className="text-xs font-bold text-indigo-600">{order.id}</p>
              <p className="text-[10px] text-slate-500">Date: {order.orderDate}</p>
            </div>
          </div>

          {/* Customer & Shipping info */}
          <div className="grid grid-cols-2 gap-4 border p-3 rounded bg-slate-50">
            <div>
              <p className="font-bold uppercase text-[10px] text-slate-500">Billed & Shipped To:</p>
              <p className="font-bold text-sm text-slate-900">{order.customer.name}</p>
              <p className="text-slate-700">{order.customer.address}</p>
              <p className="text-slate-700">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="text-slate-700">Phone: {order.customer.phone}</p>
            </div>

            <div className="font-mono text-right">
              <p className="font-bold uppercase text-[10px] text-slate-500">Logistics Info:</p>
              <p className="font-bold">{order.courierName || 'Blue Dart Express'}</p>
              <p className="text-indigo-600 font-bold">AWB: {order.trackingNumber || 'Pending Dispatch'}</p>
              <p className="text-slate-700">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse border">
            <thead>
              <tr className="bg-slate-200 uppercase text-[10px] font-mono">
                <th className="p-2 border">Item & Specification</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border text-right">Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 border font-bold">
                    {item.title} ({item.dimensions}) {item.framed ? '[Framed]' : ''}
                  </td>
                  <td className="p-2 border">{item.category}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border text-right font-mono font-bold">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-48 space-y-1 font-mono text-right text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (12%):</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-900 pt-1 text-sm">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-300 text-center text-[10px] text-slate-500">
            Thank you for purchasing original artwork from Rutuja's Art Collection.
            SQL Database Verified Record.
          </div>
        </div>
      </div>
    </div>
  );
};
