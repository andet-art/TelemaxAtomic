import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Trash2, User, Package, ClipboardList, BarChart } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, p, o] = await Promise.all([
          axios.get(`${API_BASE}/api/users`),
          axios.get(`${API_BASE}/api/products`),
          axios.get(`${API_BASE}/api/orders`)
        ]);
        setUsers(u.data);
        setProducts(p.data);
        setOrders(o.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart },
    { key: 'users', label: 'Users', icon: User },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ClipboardList }
  ];

  const renderOverview = () => (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-4 rounded-lg shadow text-center">
          <p className="text-muted-foreground">Users</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>
        <div className="bg-card p-4 rounded-lg shadow text-center">
          <p className="text-muted-foreground">Products</p>
          <h2 className="text-2xl font-bold">{products.length}</h2>
        </div>
        <div className="bg-card p-4 rounded-lg shadow text-center">
          <p className="text-muted-foreground">Orders</p>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>
        <div className="bg-card p-4 rounded-lg shadow text-center">
          <p className="text-muted-foreground">Revenue</p>
          <h2 className="text-2xl font-bold">
            {orders.reduce((sum, o: any) => sum + (parseFloat(o.total) || 0), 0).toFixed(2)} den
          </h2>
        </div>
      </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <div className="space-y-2">
        {users.map((u: any) => (
          <div key={u.id} className="bg-muted p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">{u.full_name || u.email}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
            </div>
            <button className="text-destructive"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProducts = () => (
    <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="bg-card p-4 rounded-lg shadow">
            <p className="font-semibold text-lg">{p.name}</p>
            <p className="text-muted-foreground text-sm">{p.description}</p>
            <p className="text-green-600 font-bold mt-2">{p.price} den</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <div className="space-y-2">
        {orders.map((o: any) => (
          <div key={o.id} className="bg-muted p-4 rounded-lg">
            <p><strong>Order #{o.id}</strong> — {o.total} den</p>
            <p className="text-sm text-muted-foreground">{o.full_name} · {o.payment_method} · {new Date(o.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === key
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted text-muted-foreground hover:bg-primary/10'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {tab === 'overview' && renderOverview()}
        {tab === 'users' && renderUsers()}
        {tab === 'products' && renderProducts()}
        {tab === 'orders' && renderOrders()}
      </div>
    </div>
  );
};

export default AdminDashboard;
