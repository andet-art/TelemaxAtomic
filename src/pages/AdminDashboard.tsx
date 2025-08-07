import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, ShoppingCart, TrendingUp, Search, Bell, Settings, Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    revenueData: [],
    userGrowth: [],
    topProducts: [],
    recentOrders: [],
    userDemographics: []
  });

  // Simulate database fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = {
        metrics: {
          totalUsers: 12543,
          totalRevenue: 89750,
          totalOrders: 2847,
          conversionRate: 3.2
        },
        revenueData: [
          { month: 'Jan', revenue: 65000, orders: 420 },
          { month: 'Feb', revenue: 59000, orders: 380 },
          { month: 'Mar', revenue: 80000, orders: 520 },
          { month: 'Apr', revenue: 81000, orders: 530 },
          { month: 'May', revenue: 56000, orders: 360 },
          { month: 'Jun', revenue: 89750, orders: 580 }
        ],
        userGrowth: [
          { month: 'Jan', users: 8500 },
          { month: 'Feb', users: 9200 },
          { month: 'Mar', users: 9800 },
          { month: 'Apr', users: 10500 },
          { month: 'May', users: 11200 },
          { month: 'Jun', users: 12543 }
        ],
        topProducts: [
          { name: 'Product A', sales: 145, revenue: 14500 },
          { name: 'Product B', sales: 132, revenue: 13200 },
          { name: 'Product C', sales: 98, revenue: 9800 },
          { name: 'Product D', sales: 87, revenue: 8700 },
          { name: 'Product E', sales: 76, revenue: 7600 }
        ],
        recentOrders: [
          { id: '#ORD-001', customer: 'John Doe', amount: 250, status: 'completed', date: '2025-08-07' },
          { id: '#ORD-002', customer: 'Jane Smith', amount: 180, status: 'processing', date: '2025-08-07' },
          { id: '#ORD-003', customer: 'Mike Johnson', amount: 320, status: 'completed', date: '2025-08-06' },
          { id: '#ORD-004', customer: 'Sarah Wilson', amount: 95, status: 'pending', date: '2025-08-06' },
          { id: '#ORD-005', customer: 'Tom Brown', amount: 420, status: 'completed', date: '2025-08-05' }
        ],
        userDemographics: [
          { name: '18-24', value: 25, fill: '#3b82f6' },
          { name: '25-34', value: 35, fill: '#10b981' },
          { name: '35-44', value: 20, fill: '#f59e0b' },
          { name: '45-54', value: 12, fill: '#ef4444' },
          { name: '55+', value: 8, fill: '#8b5cf6' }
        ]
      };
      
      setDashboardData(data);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const MetricCard = ({ title, value, icon: Icon, change, prefix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{prefix}{value?.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">AdminPanel</h1>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium bg-blue-600 rounded-lg">
            <TrendingUp className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Users
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
            <DollarSign className="w-5 h-5 mr-3" />
            Revenue
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </div>
      </nav>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Users"
              value={dashboardData.metrics.totalUsers}
              icon={Users}
              change={12.5}
            />
            <MetricCard
              title="Total Revenue"
              value={dashboardData.metrics.totalRevenue}
              icon={DollarSign}
              change={8.2}
              prefix="$"
            />
            <MetricCard
              title="Total Orders"
              value={dashboardData.metrics.totalOrders}
              icon={ShoppingCart}
              change={15.3}
            />
            <MetricCard
              title="Conversion Rate"
              value={dashboardData.metrics.conversionRate}
              icon={TrendingUp}
              change={-2.1}
              prefix=""
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Orders']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Demographics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.userDemographics}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {dashboardData.userDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Sales</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topProducts.map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{product.name}</td>
                        <td className="py-3 px-2 text-gray-600">{product.sales}</td>
                        <td className="py-3 px-2 text-gray-900 font-medium">${product.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 font-mono text-sm">{order.id}</td>
                        <td className="py-3 px-2">{order.customer}</td>
                        <td className="py-3 px-2 font-medium">${order.amount}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;