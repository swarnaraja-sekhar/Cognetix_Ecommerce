import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/my');
        setOrders(response.data.data);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light py-12">
          <div className="container text-center">
            <p className="text-3xl mb-6">🔒</p>
            <h1 className="text-3xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">
              Please login to view your orders
            </p>
            <Link to="/login" className="btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-light py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-4">📭</p>
              <p className="text-xl text-gray-600">No orders yet</p>
              <p className="text-gray-600 mb-8">Start by ordering some delicious food!</p>
              <Link to="/menu" className="btn-primary">
                Order Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-gray-600 text-sm">Order ID</p>
                      <p className="font-mono text-sm">
                        {order._id.substring(0, 8)}...
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Date</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Total Amount</p>
                      <p className="font-bold text-primary text-lg">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Status</p>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
