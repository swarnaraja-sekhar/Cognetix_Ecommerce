/**
 * Cart Page
 * Displays shopping cart with items and summary
 */

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { FiShoppingBag, FiArrowRight, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, cartCount, subtotal, shippingPrice, taxPrice, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              Start Shopping
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <FiTrash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-4"
            >
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shippingPrice === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>₹{shippingPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>

                {/* Tax */}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{taxPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>

                {/* Free Shipping Notice */}
                {shippingPrice > 0 && (
                  <div className="bg-primary-50 text-primary-700 text-sm p-3 rounded-lg">
                    Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free shipping!
                  </div>
                )}

                <hr />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                Proceed to Checkout
                <FiArrowRight className="w-5 h-5" />
              </button>

              {/* Secure Checkout Notice */}
              <p className="text-center text-sm text-gray-500 mt-4">
                🔒 Secure checkout powered by SSL encryption
              </p>

              {/* Accepted Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 text-center mb-3">We Accept</p>
                <div className="flex justify-center items-center gap-4 text-gray-400">
                  <span className="text-xs">Visa</span>
                  <span className="text-xs">Mastercard</span>
                  <span className="text-xs">UPI</span>
                  <span className="text-xs">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
