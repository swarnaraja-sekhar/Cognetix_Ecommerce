/**
 * Order Details Page
 * Displays detailed information about a specific order
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Loading from '../components/Loading';
import { FiArrowLeft, FiClock, FiCheck, FiTruck, FiPackage, FiX, FiMapPin, FiCreditCard } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  const isNewOrder = location.state?.newOrder;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getOrder(id);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered'];
    if (status === 'Cancelled') return -1;
    return steps.indexOf(status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }

    try {
      setCancelling(true);
      await ordersAPI.cancelOrder(id);
      
      // Refresh order details
      const response = await ordersAPI.getOrder(id);
      setOrder(response.data);
      setCancelMessage({ type: 'success', text: 'Order cancelled successfully!' });
      
      setTimeout(() => setCancelMessage(null), 3000);
    } catch (err) {
      setCancelMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to cancel order' 
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
          <Link
            to="/orders"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusStep = getStatusStep(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/orders"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Orders
        </Link>

        {/* Success Message for New Orders */}
        {isNewOrder && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FiCheck className="text-green-600 w-6 h-6 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">Order Placed Successfully!</h3>
                <p className="text-green-600">Thank you for your order. We'll send you updates about your delivery.</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-500 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              isCancelled 
                ? 'bg-red-100 text-red-700'
                : 'bg-primary-100 text-primary-700'
            }`}>
              {order.status}
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              {['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered'].map((status, index) => (
                <div key={status} className="flex flex-col items-center relative flex-1">
                  {index > 0 && (
                    <div
                      className={`absolute top-4 right-1/2 w-full h-1 ${
                        index <= statusStep ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                      style={{ transform: 'translateX(50%)' }}
                    />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= statusStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < statusStep ? (
                      <FiCheck className="w-4 h-4" />
                    ) : index === 0 ? (
                      <FiClock className="w-4 h-4" />
                    ) : index === 1 ? (
                      <FiPackage className="w-4 h-4" />
                    ) : index === 2 ? (
                      <FiCreditCard className="w-4 h-4" />
                    ) : index === 3 ? (
                      <FiTruck className="w-4 h-4" />
                    ) : (
                      <FiCheck className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs ${
                    index <= statusStep ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Message */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FiX className="text-red-600 w-6 h-6 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Order Cancelled</h3>
                <p className="text-red-600">
                  This order has been cancelled on {formatDate(order.cancelledAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiMapPin className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <p className="text-gray-600">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiCreditCard className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            </div>
            <p className="text-gray-600 mb-2">{order.paymentMethod}</p>
            <p className={`text-sm font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.isPaid 
                ? `Paid on ${formatDate(order.paidAt)}` 
                : 'Payment Pending'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product}`}
                    className="font-medium text-gray-900 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              {order.shippingPrice === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>₹{order.shippingPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (18% GST)</span>
              <span>₹{order.taxPrice.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          {cancelMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              cancelMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={cancelMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {cancelMessage.text}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              Continue Shopping
            </Link>
            {order.status === 'Pending' && (
              <button 
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-6 py-3 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
