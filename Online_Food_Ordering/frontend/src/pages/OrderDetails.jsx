import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusProgress = (status) => {
    const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    return statuses.indexOf(status);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light py-12 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light py-12">
          <div className="container text-center">
            <p className="text-xl text-red-600 mb-4">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  const progress = getStatusProgress(order.orderStatus);
  const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-light py-12">
        <div className="container max-w-4xl">
          <button
            onClick={() => navigate('/orders')}
            className="mb-6 text-primary font-semibold hover:underline"
          >
            ← Back to Orders
          </button>

          <div className="card p-8">
            {/* Order Header */}
            <div className="mb-8 pb-6 border-b">
              <h1 className="text-3xl font-bold mb-4">Order Details</h1>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="font-mono font-semibold break-all">{order._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status Progress */}
            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>
              <div className="flex items-center justify-between">
                {statuses.map((status, idx) => (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx <= progress ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      {idx <= progress ? '✓' : idx + 1}
                    </div>
                    <p className="text-sm mt-2 text-center text-gray-600">{status}</p>
                    {idx < statuses.length - 1 && (
                      <div
                        className={`h-1 w-full mt-2 ${
                          idx < progress ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-50">
                <p className="text-center font-semibold">
                  <span
                    className={`px-4 py-1 rounded-full text-white ${
                      getStatusColor(order.orderStatus).split(' ')[0]
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-semibold">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-600">{item.menuItem.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-gray-700">{order.address}</p>
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Status</h2>
              <div className={`p-4 rounded-lg ${getStatusColor(order.paymentStatus)}`}>
                <p className="font-semibold">{order.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
