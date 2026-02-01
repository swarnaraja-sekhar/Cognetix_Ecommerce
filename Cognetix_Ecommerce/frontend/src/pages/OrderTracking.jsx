/**
 * Order Tracking Page
 * Track order status with real-time updates
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="w-8 h-8" />;
      case 'Processing':
        return <FiPackage className="w-8 h-8" />;
      case 'Shipped':
        return <FiTruck className="w-8 h-8" />;
      case 'Delivered':
        return <FiCheck className="w-8 h-8" />;
      default:
        return <FiPackage className="w-8 h-8" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Processing':
        return 'text-blue-500';
      case 'Shipped':
        return 'text-purple-500';
      case 'Delivered':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const timelineSteps = [
    { label: 'Order Placed', status: 'Pending' },
    { label: 'Processing', status: 'Processing' },
    { label: 'Shipped', status: 'Shipped' },
    { label: 'Delivered', status: 'Delivered' },
  ];

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex((step) => step.status === order?.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Order not found</p>
          <Link
            to="/orders"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/orders"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order._id?.slice(-8)}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {order.isPaid ? '✓ Paid' : '○ Pending Payment'}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <div key={step.status} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <FiCheck className="w-6 h-6" />
                    ) : (
                      getStatusIcon(step.status)
                    )}
                  </div>

                  {/* Connecting Line */}
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`absolute top-12 left-6 w-0.5 h-12 ${
                        index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>

                <div className="ml-6 flex-1">
                  <h3 className="font-semibold text-gray-900">{step.label}</h3>
                  <p className="text-sm text-gray-600">
                    {index <= currentStep ? '✓ Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-gray-700">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p>{order.shippingAddress.zipCode}</p>
            <p className="mt-2 text-sm text-gray-600">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 border-b pb-4 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({order.coupon.code})</span>
                <span>-₹{order.coupon.discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              {order.shippingPrice === 0 ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                <span>₹{order.shippingPrice}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (18%)</span>
              <span>₹{order.taxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{order.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          <p className="text-gray-700">{order.paymentMethod}</p>
          {order.isPaid && (
            <p className="text-green-600 font-medium mt-2">✓ Payment Received</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
