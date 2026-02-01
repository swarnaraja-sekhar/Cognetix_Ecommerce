import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalItems: 0,
    totalRestaurants: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [adminToken, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const menuResponse = await api.get('/menu');
      const ordersResponse = await api.get('/orders');
      
      const items = menuResponse.data.data || [];
      const orders = ordersResponse.data.data || [];
      
      const restaurants = [...new Set(items.map(item => item.restaurant))];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalItems: items.length,
        totalRestaurants: restaurants.length,
        totalRevenue: totalRevenue,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
        <div className="container flex justify-between items-center py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛡️</span>
            <span className="text-2xl font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {admin?.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stats Cards */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <span className="text-5xl">📦</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Menu Items</p>
                <p className="text-4xl font-bold mt-2">{stats.totalItems}</p>
              </div>
              <span className="text-5xl">🍽️</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Restaurants</p>
                <p className="text-4xl font-bold mt-2">{stats.totalRestaurants}</p>
              </div>
              <span className="text-5xl">🏪</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue.toFixed(0)}</p>
              </div>
              <span className="text-5xl">💰</span>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Menu Management */}
          <Link to="/admin/menu" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">🍴</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Menu Items</h3>
                  <p className="text-gray-600">Manage food items</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Add, edit, delete menu items and manage inventory</p>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold group-hover:bg-blue-600 group-hover:text-white transition">
                Manage Items →
              </span>
            </div>
          </Link>

          {/* Orders Management */}
          <Link to="/admin/orders" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">📋</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Orders</h3>
                  <p className="text-gray-600">Track all orders</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">View, update and manage customer orders</p>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold group-hover:bg-green-600 group-hover:text-white transition">
                View Orders →
              </span>
            </div>
          </Link>

          {/* Users Management */}
          <Link to="/admin/users" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">👥</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Users</h3>
                  <p className="text-gray-600">Manage customers</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">View customer profiles and manage accounts</p>
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold group-hover:bg-purple-600 group-hover:text-white transition">
                View Users →
              </span>
            </div>
          </Link>

          {/* Analytics */}
          <Link to="/admin/analytics" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">📊</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Analytics</h3>
                  <p className="text-gray-600">View insights</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Track sales, revenue and business metrics</p>
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-semibold group-hover:bg-orange-600 group-hover:text-white transition">
                View Analytics →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
