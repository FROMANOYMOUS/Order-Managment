import React, { useState } from 'react';
import { Order, CustomerInfo } from '../types';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  IndianRupee, 
  Calendar,
  ExternalLink
} from 'lucide-react';

interface CustomerDirectoryViewProps {
  orders: Order[];
  isDarkMode: boolean;
}

export const CustomerDirectoryView: React.FC<CustomerDirectoryViewProps> = ({
  orders,
  isDarkMode
}) => {
  const [search, setSearch] = useState<string>('');

  // Deduplicate customers from orders
  const customerMap = new Map<string, CustomerInfo & { totalSpent: number; ordersList: string[] }>();

  orders.forEach((o) => {
    const custId = o.customer.id || o.customer.phone;
    if (!customerMap.has(custId)) {
      customerMap.set(custId, {
        ...o.customer,
        totalSpent: o.totalAmount,
        ordersList: [o.id]
      });
    } else {
      const existing = customerMap.get(custId)!;
      existing.totalSpent += o.totalAmount;
      if (!existing.ordersList.includes(o.id)) {
        existing.ordersList.push(o.id);
      }
    }
  });

  const customerList = Array.from(customerMap.values()).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
            <span>Customer Directory & Art Collector Records</span>
          </h2>
          <p className="text-xs text-slate-500">
            View art collector profiles, contact details, total lifetime spend, and order history for Rutuja's Art Collection.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Collector, City, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerList.map((customer) => (
          <div
            key={customer.id}
            className={`p-4 rounded-xl border space-y-3 transition-all ${
              isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{customer.name}</h3>
                <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">ID: {customer.id}</p>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                {customer.ordersList.length} Order{customer.ordersList.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-start space-x-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{customer.address}, {customer.city}, {customer.state} ({customer.pincode})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Lifetime Art Value:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                ₹{customer.totalSpent.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
