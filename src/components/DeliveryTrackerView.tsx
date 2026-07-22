import React, { useState } from 'react';
import { Order, DeliveryStatus } from '../types';
import { 
  Truck, 
  Package, 
  MapPin, 
  Search, 
  Calendar, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart2,
  Navigation
} from 'lucide-react';

interface DeliveryTrackerViewProps {
  orders: Order[];
  onUpdateDeliveryStatus: (order: Order) => void;
  isDarkMode: boolean;
}

export const DeliveryTrackerView: React.FC<DeliveryTrackerViewProps> = ({
  orders,
  onUpdateDeliveryStatus,
  isDarkMode
}) => {
  const [filterCourier, setFilterCourier] = useState<string>('ALL');

  const deliveryFunnel = [
    { status: 'Order Placed' as DeliveryStatus, label: 'Order Placed', count: orders.filter(o => o.deliveryStatus === 'Order Placed').length, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { status: 'Processing' as DeliveryStatus, label: 'Artwork Prep', count: orders.filter(o => o.deliveryStatus === 'Processing').length, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { status: 'Framing & Packing' as DeliveryStatus, label: 'Framing & Packing', count: orders.filter(o => o.deliveryStatus === 'Framing & Packing').length, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { status: 'Shipped' as DeliveryStatus, label: 'In Courier Transit', count: orders.filter(o => o.deliveryStatus === 'Shipped').length, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { status: 'Out for Delivery' as DeliveryStatus, label: 'Out for Delivery', count: orders.filter(o => o.deliveryStatus === 'Out for Delivery').length, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { status: 'Delivered' as DeliveryStatus, label: 'Delivered to Customer', count: orders.filter(o => o.deliveryStatus === 'Delivered').length, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' }
  ];

  const filteredOrders = orders.filter(order => {
    if (filterCourier !== 'ALL' && order.courierName !== filterCourier) return false;
    return order.deliveryStatus !== 'Cancelled';
  });

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold flex items-center space-x-2">
            <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Delivery Tracking & Logistics Engine</span>
          </h2>
          <p className="text-xs text-slate-500">
            Monitor real-time dispatch pipelines, courier tracking waybills, and transit milestones for Rutuja's Art Collection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterCourier}
            onChange={(e) => setFilterCourier(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Courier Partners</option>
            <option value="Blue Dart Express">Blue Dart Express</option>
            <option value="Delhivery Surface">Delhivery Surface</option>
            <option value="DTDC Premium Cargo">DTDC Premium Cargo</option>
            <option value="India Post SpeedPost">India Post SpeedPost</option>
          </select>
        </div>
      </div>

      {/* Delivery Stage Cards / Pipeline Funnel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {deliveryFunnel.map((stage) => (
          <div
            key={stage.status}
            className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
              isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${stage.color}`}>
                {stage.count}
              </span>
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{stage.label}</p>
              <p className="text-[10px] text-slate-500 font-mono">{stage.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Delivery Shipments Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Package className="w-4 h-4 text-indigo-500" />
          <span>Active Shipments & Waybill Dispatch Control</span>
        </h3>

        <div className={`border rounded-xl overflow-hidden transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead className={`text-[11px] font-mono uppercase border-b ${
              isDarkMode ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Artwork Item</th>
                <th className="p-3">Customer & Destination</th>
                <th className="p-3">Courier & Tracking AWB</th>
                <th className="p-3">Current Delivery Stage</th>
                <th className="p-3">Est. Delivery</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {order.id}
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.items[0]?.title || 'Artwork'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {order.items[0]?.category}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{order.customer.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{order.customer.city}, {order.customer.state} ({order.customer.pincode})</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.courierName || 'Not Assigned'}
                    </div>
                    <div className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {order.trackingNumber ? `AWB: ${order.trackingNumber}` : 'Pending Waybill'}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      order.deliveryStatus === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : order.deliveryStatus === 'Out for Delivery'
                        ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 animate-pulse'
                        : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {order.deliveryStatus}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {order.estimatedDeliveryDate || 'TBD'}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => onUpdateDeliveryStatus(order)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs inline-flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </button>
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
