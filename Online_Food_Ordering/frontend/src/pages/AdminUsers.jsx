import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, [adminToken, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock user data from orders
      const ordersResponse = await api.get('/orders');
      const uniqueUsers = {};
      
      ordersResponse.data.data?.forEach(order => {
        if (order.user?._id && !uniqueUsers[order.user._id]) {
          uniqueUsers[order.user._id] = {
            ...order.user,
            totalOrders: 0,
            totalSpent: 0,
          };
        }
        if (order.user?._id) {
          uniqueUsers[order.user._id].totalOrders += 1;
          uniqueUsers[order.user._id].totalSpent += order.totalAmount || 0;
        }
      });

      setUsers(Object.values(uniqueUsers));
      setFilteredUsers(Object.values(uniqueUsers));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 shadow-lg">
        <div className="container px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">👥 Users Management</h1>
            <p className="text-blue-100">View and manage customer accounts</p>
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
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No users found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
                {/* User Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📦 Total Orders</span>
                    <span className="font-bold text-lg text-blue-600">{user.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">💰 Total Spent</span>
                    <span className="font-bold text-lg text-green-600">₹{(user.totalSpent || 0).toFixed(0)}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-700 font-semibold">Active Customer</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition">
                    View Orders
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-600 hover:text-white transition">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{filteredUsers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {filteredUsers.reduce((sum, u) => sum + (u.totalOrders || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Revenue from Users</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{filteredUsers.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
