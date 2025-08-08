import React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Users as UsersIcon,
  Package as PackageIcon,
  BarChart3 as BarChartIcon,
  DollarSign as DollarSignIcon
} from 'lucide-react';
import { UserType, ProductType, OrderType } from '../../types/admin';

interface Props {
  users: UserType[];
  products: ProductType[];
  orders: OrderType[];
  topUsers: UserType[];
  topProducts: ProductType[];
  exportToCSV: (data: any[], filename: string) => void;
}

const Overview: React.FC<Props> = ({ users, products, orders, topUsers, topProducts, exportToCSV }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <button
          onClick={() =>
            exportToCSV(
              [
                { metric: 'Total Users', value: users.length },
                { metric: 'Total Products', value: products.length },
                { metric: 'Total Orders', value: orders.length },
                { metric: 'Total Revenue', value: totalRevenue.toFixed(2) }
              ],
              'overview_stats'
            )
          }
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} /> Export Stats
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Users</p>
              <span className="text-3xl font-bold">{users.length}</span>
            </div>
            <UsersIcon size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Products</p>
              <span className="text-3xl font-bold">{products.length}</span>
            </div>
            <PackageIcon size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Orders</p>
              <span className="text-3xl font-bold">{orders.length}</span>
            </div>
            <BarChartIcon size={40} className="text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <span className="text-3xl font-bold">{totalRevenue.toFixed(2)} den</span>
              <p className="text-sm opacity-80">Avg: {avgOrderValue.toFixed(2)} den</p>
            </div>
            <DollarSignIcon size={40} className="text-green-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-3">Top Customers</h3>
          <ul>
            {topUsers.length ? (
              topUsers.map(u => (
                <li key={u.id} className="flex justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{(u.totalSpent ?? 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{u.orderCount ?? 0} orders</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No customers yet</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-3">Top Products</h3>
          <ul>
            {topProducts.length ? (
              topProducts.map(p => (
                <li key={p.id} className="flex justify-between py-2 border-b last:border-b-0">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-right">
                    <div className="font-semibold">{(p.revenue ?? 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{p.soldQuantity ?? 0} sold</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No products yet</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
