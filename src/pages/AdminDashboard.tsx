import React, { useEffect, useState } from 'react';
import Overview from '../components/admin/Overview';
import Sales from '../components/admin/Sales';
import Users from '../components/admin/Users';
import Products from '../components/admin/Products';
import Orders from '../components/admin/Orders';
import {
  BarChart3 as OverviewIcon,
  TrendingUp as SalesIcon,
  Users as UsersIcon,
  Package as ProductsIcon,
  DollarSign as OrdersIcon
} from 'lucide-react';

import { UserType, ProductType, OrderType, SalesData } from '../types/admin';

const API_BASE = import.meta.env.VITE_API_URL;

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'sales' | 'users' | 'products' | 'orders'>('overview');
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [uRes, pRes, oRes] = await Promise.all([
          fetch(`${API_BASE}/api/users`),
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/orders`)
        ]);

        if (!uRes.ok || !pRes.ok || !oRes.ok) {
          throw new Error('One of the API calls failed');
        }

        const [uJson, pJson, oJson] = await Promise.all([
          uRes.json(),
          pRes.json(),
          oRes.json()
        ]);

        setUsers(uJson);
        setProducts(pJson);

        const norm = (oJson as any[]).map(o => ({
          id: o.id ?? 0,
          full_name: o.full_name ?? '',
          payment_method: o.payment_method ?? '',
          total: o.total ?? 0,
          timestamp: o.timestamp ?? o.created_at ?? '',
          items: o.items ?? []
        }));

        setOrders(norm);

        // Group sales by date for accurate totals
        const groupedSales = norm.reduce((acc, order) => {
          const date = order.timestamp.split('T')[0];
          if (!acc[date]) {
            acc[date] = { revenue: 0, orders: 0 };
          }
          acc[date].revenue += Number(order.total);
          acc[date].orders += 1;
          return acc;
        }, {} as Record<string, { revenue: number; orders: number }>);

        setSalesData(
          Object.entries(groupedSales).map(([date, { revenue, orders }]) => ({
            date,
            revenue,
            orders,
            avgOrderValue: revenue / orders
          }))
        );

      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(r =>
      Object.values(r).map(v => `"${v}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return (
          <Overview
            users={users}
            products={products}
            orders={orders}
            topUsers={[...users].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0)).slice(0, 5)}
            topProducts={[...products].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5)}
            exportToCSV={exportToCSV}
          />
        );
      case 'sales':
        return <Sales data={salesData} exportToCSV={exportToCSV} />;
      case 'users':
        return <Users users={users} exportToCSV={exportToCSV} />;
      case 'products':
        return <Products products={products} exportToCSV={exportToCSV} />;
      case 'orders':
        return <Orders orders={orders} exportToCSV={exportToCSV} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* No navbar here — just the page title */}
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview', icon: OverviewIcon },
          { key: 'sales', label: 'Sales', icon: SalesIcon },
          { key: 'users', label: 'Users', icon: UsersIcon },
          { key: 'products', label: 'Products', icon: ProductsIcon },
          { key: 'orders', label: 'Orders', icon: OrdersIcon }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex items-center gap-1 px-3 py-2 rounded ${
              tab === key ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
};

export default AdminDashboard;
