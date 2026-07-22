import React, { useState } from 'react';
import { Order, ArtCategory } from '../types';
import { Plus, X, Palette, User, CheckCircle2, IndianRupee } from 'lucide-react';

interface NewOrderModalProps {
  onClose: () => void;
  onSave: (newOrder: Partial<Order>) => void;
  isDarkMode: boolean;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose, onSave, isDarkMode }) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Mumbai');
  const [state, setState] = useState<string>('Maharashtra');
  const [pincode, setPincode] = useState<string>('400001');

  const [itemTitle, setItemTitle] = useState<string>('Custom Canvas Oil Painting');
  const [category, setCategory] = useState<ArtCategory>('Oil Painting');
  const [dimensions, setDimensions] = useState<string>('24x36 inches');
  const [framed, setFramed] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(25000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const subtotal = price;
    const tax = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + tax;

    const newOrder: Partial<Order> = {
      customer: {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: customerName,
        email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: customerPhone,
        address: address || 'Main Road',
        city,
        state,
        pincode,
        country: 'India'
      },
      items: [
        {
          id: `ART-${Math.floor(100 + Math.random() * 900)}`,
          title: itemTitle,
          category,
          dimensions,
          framed,
          quantity: 1,
          unitPrice: price,
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80'
        }
      ],
      subtotal,
      tax,
      shippingFee: 0,
      totalAmount,
      paymentMethod: 'UPI / GPay',
      paymentStatus: 'Paid',
      deliveryStatus: 'Order Placed',
      cancellationStatus: 'None'
    };

    onSave(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-indigo-600 text-white">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm">Create New Artwork Order Entry</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Customer info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Customer Contact Details</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Customer Full Name *"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`p-2 rounded border font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
              <input
                type="text"
                placeholder="Phone Number *"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`p-2 rounded border font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className={`p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
            </div>
          </div>

          {/* Item Info */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>Artwork & Price</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Artwork Title"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className={`p-2 rounded border font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArtCategory)}
                className={`p-2 rounded border font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              >
                <option value="Oil Painting">Oil Painting</option>
                <option value="Acrylic Canvas">Acrylic Canvas</option>
                <option value="Charcoal Sketch">Charcoal Sketch</option>
                <option value="Resin Art">Resin Art</option>
                <option value="Custom Commission">Custom Commission</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Dimensions (e.g. 24x36 inches)"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className={`p-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
              <input
                type="number"
                placeholder="Price in ₹"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`p-2 rounded border font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold flex items-center space-x-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Sync to SQL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
