import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Trash2, User, Package, ClipboardList, BarChart } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type User = {
  id: number;
  full_name: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
};

type Order = {
  id: number;
  full_name: string;
  payment_method: string;
  total: number;
  timestamp: string;
};

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('⮕ API_BASE =', API_BASE);
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Remove `/api` prefix to match your backend routes
        const [uRes, pRes, oRes] = await Promise.all([
          axios.get<User[]>(`${API_BASE}/users`),
          axios.get<Product[]>(`${API_BASE}/products`),
          axios.get<Order[]>(`${API_BASE}/orders`),
        ]);
        setUsers(uRes.data);
        setProducts(pRes.data);
        setOrders(oRes.data);
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)   return <div className="p-6 text-center text-destructive">Error: {error}</div>;

  const renderOverview = () => (
    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
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
            {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} den
          </h2>
        </div>
      </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="bg-muted p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">{u.full_name}</p>
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
        {products.map(p => (
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
        {orders.map(o => (
          <div key={o.id} className="bg-muted p-4 rounded-lg">
            <p><strong>Order #{o.id}</strong> — {o.total} den</p>
            <p className="text-sm text-muted-foreground">
              {o.full_name} · {o.payment_method} · {new Date(o.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {[
          { key: 'overview', label: 'Overview', icon: BarChart },
          { key: 'users',    label: 'Users',    icon: User     },
          { key: 'products', label: 'Products', icon: Package  },
          { key: 'orders',   label: 'Orders',   icon: ClipboardList }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
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
        {tab === 'users'    && renderUsers()}
        {tab === 'products' && renderProducts()}
        {tab === 'orders'   && renderOrders()}
      </div>
    </div>
  );
};

export default AdminDashboard;
