import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Trash2, Edit, Check, X, Download, BarChart3, 
  TrendingUp, Users, Package, DollarSign, Calendar,
  ChevronDown, Filter, Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock API functions (replace with your actual API calls)
// new
const API_BASE = import.meta.env.VITE_API_URL;


type UserType = { 
  id: number; 
  name: string; 
  email: string; 
  totalSpent?: number;
  orderCount?: number;
};

type ProductType = { 
  id: number; 
  name: string; 
  description?: string; 
  price: number;
  stock?: number;
  status?: 'active' | 'inactive';
  soldQuantity?: number;
  revenue?: number;
};

type OrderType = { 
  id: number; 
  full_name: string; 
  payment_method: string; 
  total: number; 
  timestamp: string;
  items?: { productId: number; quantity: number; price: number }[];
};

type ActivityType = { 
  action: string; 
  details?: string; 
  ip?: string; 
  created_at: string; 
};

type SalesData = {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
};

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'users' | 'products' | 'orders' | 'sales'>('overview');
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User management states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUserName, setEditedUserName] = useState('');
  const [editedUserEmail, setEditedUserEmail] = useState('');
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [showActivities, setShowActivities] = useState(false);
  const [activeUserName, setActiveUserName] = useState('');

  // Product management states
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState({ name: '', price: 0, stock: 0, status: 'active' as 'active' | 'inactive' });
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Sales dashboard states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Mock data generation
  const generateMockSalesData = (): SalesData[] => {
    const data: SalesData[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const revenue = Math.random() * 5000 + 1000;
      const orderCount = Math.floor(Math.random() * 50) + 10;
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(revenue),
        orders: orderCount,
        avgOrderValue: Math.round(revenue / orderCount)
      });
    }
    return data;
  };

  // Enhanced mock data with additional fields
  const generateEnhancedMockData = () => {
    const mockUsers: UserType[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', totalSpent: 2500, orderCount: 12 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', totalSpent: 1800, orderCount: 8 },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', totalSpent: 3200, orderCount: 15 },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', totalSpent: 1200, orderCount: 5 },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', totalSpent: 4100, orderCount: 18 },
    ];

    const mockProducts: ProductType[] = [
      { id: 1, name: 'Laptop Pro', description: 'High-performance laptop', price: 1299, stock: 25, status: 'active', soldQuantity: 45, revenue: 58455 },
      { id: 2, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 49, stock: 150, status: 'active', soldQuantity: 120, revenue: 5880 },
      { id: 3, name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 129, stock: 0, status: 'inactive', soldQuantity: 80, revenue: 10320 },
      { id: 4, name: 'Monitor 4K', description: '27-inch 4K monitor', price: 399, stock: 12, status: 'active', soldQuantity: 35, revenue: 13965 },
      { id: 5, name: 'USB-C Hub', description: 'Multi-port USB-C hub', price: 79, stock: 65, status: 'active', soldQuantity: 95, revenue: 7505 },
    ];

    const mockOrders: OrderType[] = [
      { id: 1, full_name: 'John Doe', payment_method: 'Credit Card', total: 1299, timestamp: '2025-01-15T10:30:00Z' },
      { id: 2, full_name: 'Jane Smith', payment_method: 'PayPal', total: 178, timestamp: '2025-01-14T15:45:00Z' },
      { id: 3, full_name: 'Bob Johnson', payment_method: 'Credit Card', total: 399, timestamp: '2025-01-13T09:20:00Z' },
      { id: 4, full_name: 'Alice Brown', payment_method: 'Bank Transfer', total: 49, timestamp: '2025-01-12T14:15:00Z' },
      { id: 5, full_name: 'Charlie Wilson', payment_method: 'Credit Card', total: 508, timestamp: '2025-01-11T11:00:00Z' },
    ];

    return { mockUsers, mockProducts, mockOrders };
  };

  useEffect(() => {
  // Helper to build last-30-day sales data
  const computeSalesData = (orders: OrderType[]): SalesData[] => {
    const today = new Date();
    const map: Record<string, { revenue: number; orders: number }> = {};

    // initialize each day
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = { revenue: 0, orders: 0 };
    }

    // accumulate from real orders
    orders.forEach(o => {
      const day = o.timestamp.split('T')[0];
      if (map[day]) {
        map[day].revenue += o.total;
        map[day].orders += 1;
      }
    });

    // build array with avgOrderValue
    return Object.entries(map).map(([date, { revenue, orders }]) => ({
      date,
      revenue,
      orders,
      avgOrderValue: orders > 0 ? Math.round(revenue / orders) : 0
    }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // fetch all three resources in parallel
      const [uRes, pRes, oRes] = await Promise.all([
        fetch(`${API_BASE}/api/users`),
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/orders`)
      ]);

      if (!uRes.ok || !pRes.ok || !oRes.ok) {
        throw new Error('Failed to fetch data.');
      }

      const [usersData, productsData, ordersData] = await Promise.all([
        uRes.json(),
        pRes.json(),
        oRes.json()
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);

      // compute real sales data
      setSalesData(computeSalesData(ordersData));

      // set date range: last 30 days
      const today = new Date();
      const before = new Date();
      before.setDate(today.getDate() - 30);
      setDateRange({
        start: before.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

    

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // User management functions
  const filteredUsers = useMemo(
    () => users.filter(u =>
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    ),
    [users, userSearchTerm]
  );

  const allUsersSelected = useMemo(
    () => filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.has(u.id)),
    [filteredUsers, selectedUserIds]
  );

  const toggleSelectAllUsers = () => {
    const next = new Set(selectedUserIds);
    if (allUsersSelected) filteredUsers.forEach(u => next.delete(u.id));
    else filteredUsers.forEach(u => next.add(u.id));
    setSelectedUserIds(next);
  };

  const toggleSelectUser = (id: number) => {
    const next = new Set(selectedUserIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedUserIds(next);
  };

  // Product management functions
  const filteredProducts = useMemo(
    () => products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearchTerm.toLowerCase());
      const matchesStatus = productStatusFilter === 'all' || p.status === productStatusFilter;
      return matchesSearch && matchesStatus;
    }),
    [products, productSearchTerm, productStatusFilter]
  );

  const allProductsSelected = useMemo(
    () => filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.has(p.id)),
    [filteredProducts, selectedProductIds]
  );

  const toggleSelectAllProducts = () => {
    const next = new Set(selectedProductIds);
    if (allProductsSelected) filteredProducts.forEach(p => next.delete(p.id));
    else filteredProducts.forEach(p => next.add(p.id));
    setSelectedProductIds(next);
  };

  const toggleSelectProduct = (id: number) => {
    const next = new Set(selectedProductIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedProductIds(next);
  };

  const startEditProduct = (p: ProductType) => {
    setEditingProductId(p.id);
    setEditedProduct({
      name: p.name,
      price: p.price,
      stock: p.stock || 0,
      status: p.status || 'active'
    });
  };

  const saveProductEdit = async () => {
    if (editingProductId == null) return;
    
    // Mock API call - replace with actual API
    const updatedProduct = {
      ...products.find(p => p.id === editingProductId),
      ...editedProduct
    };
    
    setProducts(products.map(p => p.id === editingProductId ? updatedProduct as ProductType : p));
    setEditingProductId(null);
  };

  const handleBulkProductAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (!selectedProductIds.size) return;
    
    if (action === 'delete') {
      if (!window.confirm(`Delete ${selectedProductIds.size} products?`)) return;
      setProducts(products.filter(p => !selectedProductIds.has(p.id)));
    } else {
      const status = action === 'activate' ? 'active' : 'inactive';
      setProducts(products.map(p => 
        selectedProductIds.has(p.id) ? { ...p, status } : p
      ));
    }
    
    setSelectedProductIds(new Set());
  };

  // Top performers calculations
  const topProducts = useMemo(
    () => products
      .filter(p => p.soldQuantity && p.revenue)
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5),
    [products]
  );

  const topCustomers = useMemo(
    () => users
      .filter(u => u.totalSpent)
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 5),
    [users]
  );

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  // Enhanced Overview Tab
  const renderOverview = () => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / orders.length;
    
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <button
            onClick={() => exportToCSV([
              { metric: 'Total Users', value: users.length },
              { metric: 'Total Products', value: products.length },
              { metric: 'Total Orders', value: orders.length },
              { metric: 'Total Revenue', value: totalRevenue.toFixed(2) }
            ], 'overview_stats')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={16} />
            Export Stats
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Users</p>
                <span className="text-3xl font-bold">{users.length}</span>
              </div>
              <Users size={40} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Products</p>
                <span className="text-3xl font-bold">{products.length}</span>
              </div>
              <Package size={40} className="text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Orders</p>
                <span className="text-3xl font-bold">{orders.length}</span>
              </div>
              <BarChart3 size={40} className="text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Revenue</p>
                <span className="text-2xl font-bold">{totalRevenue.toFixed(0)} den</span>
                <p className="text-xs text-orange-200">Avg: {avgOrderValue.toFixed(0)} den</p>
              </div>
              <DollarSign size={40} className="text-orange-200" />
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Top Products</h3>
              <button
                onClick={() => exportToCSV(topProducts, 'top_products')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.soldQuantity} sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">{product.revenue?.toFixed(0)} den</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Top Customers</h3>
              <button
                onClick={() => exportToCSV(topCustomers, 'top_customers')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {topCustomers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.orderCount} orders</p>
                    </div>
                  </div>
                  <span className="font-bold text-purple-600">{user.totalSpent?.toFixed(0)} den</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Enhanced Products Tab
  const renderProducts = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => exportToCSV(filteredProducts, 'products')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} />
          Export Products
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearchTerm}
                onChange={e => setProductSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={productStatusFilter}
            onChange={e => setProductStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {selectedProductIds.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkProductAction('activate')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Activate ({selectedProductIds.size})
            </button>
            <button
              onClick={() => handleBulkProductAction('deactivate')}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Deactivate ({selectedProductIds.size})
            </button>
            <button
              onClick={() => handleBulkProductAction('delete')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete ({selectedProductIds.size})
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">
                <input 
                  type="checkbox" 
                  checked={allProductsSelected} 
                  onChange={toggleSelectAllProducts}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </th>
              <th className="text-left p-4 font-semibold">Product</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Stock</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Sold</th>
              <th className="text-left p-4 font-semibold">Revenue</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectedProductIds.has(product.id)} 
                    onChange={() => toggleSelectProduct(product.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </td>
                <td className="p-4">
                  {editingProductId === product.id ? (
                    <input
                      value={editedProduct.name}
                      onChange={e => setEditedProduct({...editedProduct, name: e.target.value})}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={e => setEditedProduct({...editedProduct, price: Number(e.target.value)})}
                      className="w-20 border rounded px-2 py-1"
                    />
                  ) : (
                    <span className="font-medium">{product.price} den</span>
                  )}
                </td>
                <td className="p-4">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      value={editedProduct.stock}
                      onChange={e => setEditedProduct({...editedProduct, stock: Number(e.target.value)})}
                      className="w-20 border rounded px-2 py-1"
                    />
                  ) : (
                    <span className={`${(product.stock || 0) === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock || 0}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {editingProductId === product.id ? (
                    <select
                      value={editedProduct.status}
                      onChange={e => setEditedProduct({...editedProduct, status: e.target.value as 'active' | 'inactive'})}
                      className="border rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status || 'active'}
                    </span>
                  )}
                </td>
                <td className="p-4 text-gray-600">{product.soldQuantity || 0}</td>
                <td className="p-4 font-medium text-green-600">{product.revenue?.toFixed(0) || 0} den</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {editingProductId === product.id ? (
                      <>
                        <button onClick={saveProductEdit} className="text-green-600 hover:text-green-800">
                          <Check size={18} />
                        </button>
                        <button onClick={() => setEditingProductId(null)} className="text-red-600 hover:text-red-800">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditProduct(product)} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete ${product.name}?`)) {
                              setProducts(products.filter(p => p.id !== product.id));
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  // Sales Dashboard Tab
  const renderSales = () => {
    const filteredSalesData = salesData.filter(d => {
      if (!dateRange.start || !dateRange.end) return true;
      return d.date >= dateRange.start && d.date <= dateRange.end;
    });

    const totalRevenue = filteredSalesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = filteredSalesData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Sales Dashboard</h2>
          <button
            onClick={() => exportToCSV(filteredSalesData, 'sales_data')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>

        {/* Date Range Picker */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <Calendar size={20} className="text-gray-500" />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
                className="border rounded px-3 py-1"
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Revenue</p>
                <span className="text-2xl font-bold">{totalRevenue.toFixed(0)} den</span>
              </div>
              <DollarSign size={32} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Orders</p>
                <span className="text-2xl font-bold">{totalOrders}</span>
              </div>
              <BarChart3 size={32} className="text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Avg Order Value</p>
                <span className="text-2xl font-bold">{avgOrderValue.toFixed(0)} den</span>
              </div>
              <TrendingUp size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Over Time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Volume */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Order Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Order Value */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Average Order Value</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgOrderValue" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Revenue Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Revenue by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  // Users Tab (existing functionality with export)
  const renderUsers = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => exportToCSV(filteredUsers, 'users')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={16} />
          Export Users
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4 space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={e => setUserSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {selectedUserIds.size > 0 && (
            <button 
              onClick={async () => {
                if (!window.confirm(`Delete ${selectedUserIds.size} users?`)) return;
                setUsers(users.filter(u => !selectedUserIds.has(u.id)));
                setSelectedUserIds(new Set());
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete ({selectedUserIds.size})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">
                  <input 
                    type="checkbox" 
                    checked={allUsersSelected} 
                    onChange={toggleSelectAllUsers}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Orders</th>
                <th className="text-left p-4 font-semibold">Total Spent</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedUserIds.has(user.id)} 
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="p-4">
                    {editingUserId === user.id ? (
                      <input
                        value={editedUserName}
                        onChange={e => setEditedUserName(e.target.value)}
                        className="border rounded p-1 w-full"
                      />
                    ) : user.name}
                  </td>
                  <td className="p-4">
                    {editingUserId === user.id ? (
                      <input
                        value={editedUserEmail}
                        onChange={e => setEditedUserEmail(e.target.value)}
                        className="border rounded p-1 w-full"
                      />
                    ) : user.email}
                  </td>
                  <td className="p-4 text-gray-600">{user.orderCount || 0}</td>
                  <td className="p-4 font-medium text-green-600">{user.totalSpent?.toFixed(0) || 0} den</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {editingUserId === user.id ? (
                        <>
                          <button 
                            onClick={async () => {
                              // Mock save - replace with actual API call
                              setUsers(users.map(u => u.id === editingUserId ? 
                                {...u, name: editedUserName, email: editedUserEmail} : u
                              ));
                              setEditingUserId(null);
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingUserId(null)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditedUserName(user.name);
                              setEditedUserEmail(user.email);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={async () => {
                              // Mock activity fetch - replace with actual API call
                              const mockActivities: ActivityType[] = [
                                { action: 'Login', created_at: '2025-01-15T10:30:00Z', ip: '192.168.1.1' },
                                { action: 'Purchase', details: 'Laptop Pro', created_at: '2025-01-15T11:00:00Z' },
                                { action: 'Profile Update', created_at: '2025-01-14T15:00:00Z' },
                              ];
                              setActivities(mockActivities);
                              setActiveUserName(user.name);
                              setShowActivities(true);
                            }}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Delete ${user.name}?`)) {
                                setUsers(users.filter(u => u.id !== user.id));
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-auto relative">
            <button 
              onClick={() => setShowActivities(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Activity for {activeUserName}</h3>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      {activity.details && (
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      )}
                      {activity.ip && (
                        <p className="text-xs text-gray-500 mt-1">IP: {activity.ip}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => exportToCSV(activities, `${activeUserName}_activities`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Download size={16} />
                Export Activities
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  // Enhanced Orders Tab
  const renderOrders = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600">Total Orders</p>
          <span className="text-2xl font-bold">{orders.length}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600">Total Revenue</p>
          <span className="text-2xl font-bold text-green-600">
            {orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)} den
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600">Average Order</p>
          <span className="text-2xl font-bold text-blue-600">
            {orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(0) : 0} den
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600">This Month</p>
          <span className="text-2xl font-bold text-purple-600">
            {orders.filter(o => {
              const orderDate = new Date(o.timestamp);
              const now = new Date();
              return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }).length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Order ID</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Payment Method</th>
                <th className="text-left p-4 font-semibold">Total</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <span className="font-mono text-blue-600">#{order.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.full_name}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                      {order.payment_method}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-green-600">{order.total.toFixed(0)} den</span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Dashboard v1.2</h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white rounded-lg shadow">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'sales', label: 'Sales', icon: TrendingUp },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'products', label: 'Products', icon: Package },
            { key: 'orders', label: 'Orders', icon: DollarSign }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                tab === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {tab === 'overview' && renderOverview()}
          {tab === 'sales' && renderSales()}
          {tab === 'users' && renderUsers()}
          {tab === 'products' && renderProducts()}
          {tab === 'orders' && renderOrders()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

