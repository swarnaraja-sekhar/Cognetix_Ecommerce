import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    setError('');

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        orderValue: getCartTotal(),
      });

      setAppliedCoupon(response.data.coupon);
      setDiscountAmount(response.data.discount);
      setCouponCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Please enter delivery address');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        totalAmount: getCartTotal() - discountAmount,
        address: address,
        couponCode: appliedCoupon?.code || null,
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      navigate(`/orders/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const total = subtotal - discountAmount;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-light py-12">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Order Details</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center pb-4 border-b"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="bg-blue-50 p-4 rounded mb-6">
                <h3 className="font-bold mb-3">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="input-field flex-1"
                    disabled={appliedCoupon}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || appliedCoupon}
                    className="btn-primary px-4 disabled:opacity-50"
                  >
                    {validatingCoupon ? 'Validating...' : 'Apply'}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 p-2 bg-green-100 text-green-700 rounded">
                    ✓ Coupon applied: {appliedCoupon.code} - ₹{discountAmount.toFixed(2)} discount
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setDiscountAmount(0);
                      }}
                      className="ml-auto text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {/* User Info (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="input-field bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="input-field bg-gray-100"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    rows="4"
                    className="input-field"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Payment Method
                  </label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-gray-700">
                      💳 Card Payment (Cash on Delivery coming soon)
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 py-3"
                >
                  {loading ? 'Placing Order...' : `Pay ₹${total.toFixed(2)}`}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="w-full btn-outline py-3"
                >
                  Back to Cart
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
