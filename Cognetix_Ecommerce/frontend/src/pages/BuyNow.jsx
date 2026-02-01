/**
 * Buy Now Page
 * Direct purchase page with product details and payment options
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { productsAPI, ordersAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import CouponInput from '../components/CouponInput';
import { FiArrowLeft, FiMinus, FiPlus, FiMapPin, FiCreditCard, FiTruck, FiShield, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BuyNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, updateProfile } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    phone: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: { pathname: `/buy-now/${id}` } } });
    }
  }, [isAuthenticated, navigate, id]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProduct(id);
        setProduct(response.data);
        
        // Get quantity from URL params if provided
        const qty = searchParams.get('qty');
        if (qty) {
          setQuantity(Math.min(parseInt(qty), response.data.stock));
        }
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, searchParams, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Calculate totals
  const subtotal = product ? product.price * quantity : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shippingPrice = subtotalAfterDiscount > 500 ? 0 : 50;
  const taxRate = 0.18;
  const taxPrice = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + shippingPrice + taxPrice;

  const validateAddress = () => {
    const { street, city, state, zipCode, phone } = shippingAddress;
    if (!street || !city || !state || !zipCode || !phone) {
      toast.error('Please fill in all address fields');
      return false;
    }
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  // Show confirmation modal before placing order
  const handlePlaceOrderClick = () => {
    if (!validateAddress()) return;
    setShowConfirmModal(true);
  };

  // Confirm and place the order
  const confirmPlaceOrder = async () => {
    setShowConfirmModal(false);
    
    try {
      setPlacing(true);

      // Save address to profile if checkbox is checked
      if (saveAddressToProfile && updateProfile) {
        try {
          await updateProfile({
            address: {
              street: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zipCode: shippingAddress.zipCode,
              country: shippingAddress.country,
            }
          });
          toast.success('Address saved to profile!');
        } catch (err) {
          console.error('Failed to save address:', err);
          // Continue with order even if address save fails
        }
      }

      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: quantity,
          },
        ],
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        paymentMethod: paymentMethod,
      };

      const response = await ordersAPI.createOrder(orderData);

      if (response.success) {
        toast.success('Order placed successfully!');
        // Navigate to orders list after a short delay to show the success message
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Product not found</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiMapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                  <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="House No, Building, Street, Area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    placeholder="PIN Code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">Choose how you want to pay</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Cash on Delivery</span>
                      <span className="text-2xl">💵</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                  </div>
                </label>

                {/* UPI */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'upi'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">UPI Payment</span>
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pay using Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>

                {/* Card */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Credit / Debit Card</span>
                      <span className="text-2xl">💳</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Visa, Mastercard, Rupay accepted</p>
                  </div>
                </label>

                {/* Net Banking */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Net Banking</span>
                      <span className="text-2xl">🏦</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">All major banks supported</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Product Card */}
              <div className="flex gap-4 pb-6 border-b">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="py-4 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.stock} available)
                  </span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="py-4 border-b">
                <CouponInput
                  orderAmount={subtotal}
                  onCouponApplied={setAppliedCoupon}
                />
              </div>

              {/* Price Details */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span>₹{shippingPrice}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{taxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrderClick}
                disabled={placing}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {placing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  `Place Order • ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiTruck className="w-5 h-5 text-blue-500" />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiShield className="w-5 h-5 text-green-500" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiCheck className="w-5 h-5 text-purple-500" />
                  <span>7 Day Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Confirm Order</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {quantity}</p>
                  <p className="font-bold text-gray-900 mt-1">
                    ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address Preview */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Delivering to:</p>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}</p>
                <p className="mt-1">📞 {shippingAddress.phone}</p>
              </div>
            </div>

            {/* Save Address Checkbox */}
            <label className="flex items-start gap-3 p-4 bg-green-50 rounded-lg cursor-pointer mb-6 border-2 border-green-200 hover:border-green-400 transition">
              <input
                type="checkbox"
                checked={saveAddressToProfile}
                onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="font-medium text-gray-900">Save this address to my profile</span>
                <p className="text-sm text-gray-500 mt-1">
                  Use this address for future orders automatically
                </p>
              </div>
            </label>

            {/* Payment Method */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Method:</p>
              <p className="text-gray-900 font-medium">
                {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                {paymentMethod === 'upi' && '📱 UPI Payment'}
                {paymentMethod === 'card' && '💳 Credit/Debit Card'}
                {paymentMethod === 'netbanking' && '🏦 Net Banking'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmPlaceOrder}
                disabled={placing}
                className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {placing ? 'Placing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyNow;
