import React from 'react';
import { Order } from '../types';
import { 
  BarChart3, 
  IndianRupee, 
  TrendingUp, 
  PieChart as PieIcon, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Package
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

interface AnalyticsViewProps {
  orders: Order[];
  isDarkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ orders, isDarkMode }) => {
  // Compute metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const deliveredCount = orders.filter(o => o.deliveryStatus === 'Delivered').length;
  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 0;

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + item.unitPrice * item.quantity;
    });
  });

  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  // Delivery status distribution
  const statusMap: Record<string, number> = {};
  orders.forEach(o => {
    statusMap[o.deliveryStatus] = (statusMap[o.deliveryStatus] || 0) + 1;
  });

  const statusData = Object.keys(statusMap).map(st => ({
    name: st,
    count: statusMap[st]
  }));

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="w-5 h-5" />
          <span>Analytics & Revenue Dashboard</span>
        </h2>
        <p className="text-xs text-slate-500">
          Sales performance metrics, artwork category breakdown, and delivery throughput for Rutuja's Art Collection.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Sales Revenue</p>
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <IndianRupee className="w-8 h-8 text-indigo-500" />
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Average Order Value (AOV)</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500" />
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Orders Logged</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {totalOrdersCount}
            </p>
          </div>
          <Package className="w-8 h-8 text-amber-500" />
        </div>

        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Delivery Completion Rate</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {deliverySuccessRate}%
            </p>
          </div>
          <Truck className="w-8 h-8 text-cyan-500" />
        </div>
      </div>

      {/* Visual Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Bar Chart */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-indigo-500" />
            <span>Revenue by Artwork Category (₹ INR)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: '#64748b', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Status Funnel Pie Chart */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Truck className="w-4 h-4 text-emerald-500" />
            <span>Delivery Pipeline Distribution</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: '#64748b', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
