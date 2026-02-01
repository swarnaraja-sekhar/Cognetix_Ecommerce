import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');

  const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [adminToken, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = orders;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.includes(searchTerm) ||
        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [filterStatus, searchTerm, orders]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Preparing': 'bg-purple-100 text-purple-700',
      'Ready': 'bg-green-100 text-green-700',
      'Out for Delivery': 'bg-orange-100 text-orange-700',
      'Delivered': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 shadow-lg">
        <div className="container px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📋 Orders Management</h1>
            <p className="text-blue-100">Track and manage all customer orders</p>
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
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by order ID, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No orders found</div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
                {/* Order Header */}
                <div className="grid md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Order ID</p>
                    <p className="text-xl font-bold text-gray-800">{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Customer</p>
                    <p className="text-lg font-semibold text-gray-800">{order.user?.name}</p>
                    <p className="text-sm text-gray-600">{order.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <p className="font-bold text-gray-800 mb-3">Items:</p>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700 bg-gray-50 p-3 rounded">
                        <span>
                          {item.menuItem?.name || 'Item'} x{item.quantity}
                        </span>
                        <span className="font-semibold">₹{(item.menuItem?.price * item.quantity)?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <span className="font-bold">📍 Delivery Address:</span> {order.address}
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">Current Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:border-blue-600"
                  >
                    {statuses.filter(s => s !== 'All').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{filteredOrders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {filteredOrders.filter(o => o.status === 'Delivered').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {filteredOrders.filter(o => ['Pending', 'Confirmed', 'Preparing'].includes(o.status)).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
