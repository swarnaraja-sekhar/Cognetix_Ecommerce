import React, { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { couponService } from '../services/featureService';

const CouponInput = ({ orderAmount, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      const response = await couponService.validateCoupon(couponCode, orderAmount);
      if (response.success) {
        setShowValidation(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await couponService.applyCoupon(couponCode, orderAmount);
      if (response.success) {
        setAppliedCoupon({
          code: response.data.code,
          discountAmount: response.data.discountAmount,
          finalAmount: response.data.finalAmount,
        });
        setShowValidation(false);
        toast.success('Coupon applied successfully');
        if (onCouponApplied) {
          onCouponApplied(response.data);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setShowValidation(false);
    if (onCouponApplied) {
      onCouponApplied(null);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCheck className="text-green-600" size={20} />
            <div>
              <p className="font-semibold text-green-900">Coupon Applied</p>
              <p className="text-sm text-green-700">{appliedCoupon.code}</p>
              <p className="text-sm text-green-700">
                Discount: ₹{appliedCoupon.discountAmount}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800 transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <form onSubmit={handleValidate} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Validate'}
          </button>
        </div>

        {showValidation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
            <p className="text-sm text-blue-900">Coupon is valid!</p>
            <button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? 'Applying...' : 'Apply Coupon'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CouponInput;
