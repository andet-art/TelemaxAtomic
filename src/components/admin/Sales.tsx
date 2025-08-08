import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, DollarSign, BarChart3 as BarChartIcon, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { SalesData } from '../../types/admin';

interface Props {
  data: SalesData[];
  exportToCSV: (data: any[], filename: string) => void;
}

const Sales: React.FC<Props> = ({ data, exportToCSV }) => {
  const [filtered, setFiltered] = useState<SalesData[]>([]);

  // sync filtered when prop changes (keeps component reactive)
  useEffect(() => {
    setFiltered(Array.isArray(data) ? data : []);
  }, [data]);

  const totalRevenue = useMemo(() => filtered.reduce((s, d) => s + (d.revenue ?? 0), 0), [filtered]);
  const totalOrders = useMemo(() => filtered.reduce((s, d) => s + (d.orders ?? 0), 0), [filtered]);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const chartData = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filtered]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Dashboard</h2>
        <button
          onClick={() => exportToCSV(filtered, 'sales_data')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Revenue</p>
              <span className="text-2xl font-bold">{totalRevenue.toFixed(2)} den</span>
            </div>
            <DollarSign size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Orders</p>
              <span className="text-2xl font-bold">{totalOrders}</span>
            </div>
            <BarChartIcon size={32} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Avg Order Value</p>
              <span className="text-2xl font-bold">{avgOrderValue.toFixed(2)} den</span>
            </div>
            <TrendingUp size={32} className="text-green-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-3">Revenue (by date)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => String(d).slice(5)} />
                <YAxis />
                <Tooltip formatter={(value: any) => [value, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-3">Orders (by date)</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => String(d).slice(5)} />
                <YAxis />
                <Tooltip formatter={(value: any) => [value, 'Orders']} />
                <Bar dataKey="orders" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sales;
