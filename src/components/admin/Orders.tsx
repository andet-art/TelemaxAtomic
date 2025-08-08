import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { OrderType } from '../../types/admin';

interface Props {
  orders: OrderType[];
  exportToCSV: (data: any[], filename: string) => void;
}

const Orders: React.FC<Props> = ({ orders, exportToCSV }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total as any || '0'), 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const thisMonth = orders.filter(o => {
    const d = new Date(o.timestamp);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button
          onClick={() => exportToCSV(orders, 'orders')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} />
          Export Orders
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h4 className="text-gray-500">Total Revenue</h4>
          <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h4 className="text-gray-500">Avg Order Value</h4>
          <p className="text-xl font-bold">${avgOrder.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h4 className="text-gray-500">Orders This Month</h4>
          <p className="text-xl font-bold">{thisMonth}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-center">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{o.full_name}</td>
                <td className="p-2">{o.email}</td>
                <td className="p-2">{o.phone}</td>
                <td className="p-2">${parseFloat(o.total as any).toFixed(2)}</td>
                <td className="p-2">
                  {new Date(o.timestamp).toLocaleDateString()} <br />
                  <span className="text-xs text-gray-500">
                    {new Date(o.timestamp).toLocaleTimeString()}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <details className="cursor-pointer">
                    <summary className="text-blue-600 text-sm flex items-center justify-center gap-1">
                      <Eye size={14} />
                      View
                    </summary>
                    <ul className="mt-2 text-xs text-left px-2 space-y-1">
                      {Array.isArray(o.items) && o.items.length > 0 ? (
                        o.items.map((item, idx) => (
                          <li key={idx}>
                            • {item.name} × {item.quantity} — ${item.price}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No items</li>
                      )}
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Orders;
