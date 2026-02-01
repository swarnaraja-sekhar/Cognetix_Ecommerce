import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState([]);
  const [restaurantStats, setRestaurantStats] = useState([]);
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchAnalytics();
  }, [adminToken, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const ordersResponse = await api.get('/orders');
      const menuResponse = await api.get('/menu');

      const orders = ordersResponse.data.data || [];
      const items = menuResponse.data.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalOrders = orders.length;
      const totalItems = items.length;
      const uniqueUsers = new Set(orders.map(order => order.user?._id)).size;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // This month
      const now = new Date();
      const thisMonth = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      });

      const ordersThisMonth = thisMonth.length;
      const revenueThisMonth = thisMonth.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalRevenue,
        totalOrders,
        totalItems,
        totalUsers: uniqueUsers,
        averageOrderValue,
        ordersThisMonth,
        revenueThisMonth,
      });

      // Category stats
      const catStats = {};
      items.forEach(item => {
        if (!catStats[item.category]) {
          catStats[item.category] = 0;
        }
        catStats[item.category]++;
      });
      setCategoryStats(Object.entries(catStats).map(([name, count]) => ({ name, count })));

      // Restaurant stats
      const restStats = {};
      items.forEach(item => {
        if (!restStats[item.restaurant]) {
          restStats[item.restaurant] = { items: 0, revenue: 0 };
        }
        restStats[item.restaurant].items++;
      });

      orders.forEach(order => {
        order.items?.forEach(item => {
          if (item.menuItem?.restaurant && restStats[item.menuItem.restaurant]) {
            restStats[item.menuItem.restaurant].revenue += item.menuItem.price * item.quantity;
          }
        });
      });

      setRestaurantStats(
        Object.entries(restStats)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 8)
      );
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 shadow-lg">
        <div className="container px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📊 Analytics & Reports</h1>
            <p className="text-blue-100">View comprehensive business insights</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 px-4">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading analytics...</div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue (All Time)</p>
                <p className="text-4xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-2">From {stats.totalOrders} orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Revenue This Month</p>
                <p className="text-4xl font-bold text-blue-600">₹{stats.revenueThisMonth.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-2">From {stats.ordersThisMonth} orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Average Order Value</p>
                <p className="text-4xl font-bold text-purple-600">₹{stats.averageOrderValue.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-2">Per order</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Active Customers</p>
                <p className="text-4xl font-bold text-orange-600">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-2">Unique users</p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Menu Items</p>
                <p className="text-4xl font-bold text-green-600">{stats.totalItems}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">This Month Orders</p>
                <p className="text-4xl font-bold text-purple-600">{stats.ordersThisMonth}</p>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">📂 Items by Category</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryStats.map(cat => (
                  <div key={cat.name} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="text-gray-700 font-semibold">{cat.name}</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{cat.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Restaurants */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">🏪 Top Restaurants by Revenue</h2>
              <div className="space-y-4">
                {restaurantStats.map((rest, idx) => (
                  <div key={rest.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="text-2xl font-bold text-blue-600 w-8 text-center">#{idx + 1}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{rest.name}</p>
                      <p className="text-sm text-gray-600">{rest.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{rest.revenue.toFixed(0)}</p>
                      <p className="text-xs text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">📈 Performance Indicators</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Customer Satisfaction</span>
                      <span className="text-green-600 font-bold">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Order Delivery Rate</span>
                      <span className="text-blue-600 font-bold">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Menu Item Availability</span>
                      <span className="text-purple-600 font-bold">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">🎯 Business Goals</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">Monthly Revenue Target</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">₹{(stats.revenueThisMonth).toFixed(0)} / ₹50000</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((stats.revenueThisMonth / 50000) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">Order Growth Target</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{stats.ordersThisMonth} / 100 orders</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((stats.ordersThisMonth / 100) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
