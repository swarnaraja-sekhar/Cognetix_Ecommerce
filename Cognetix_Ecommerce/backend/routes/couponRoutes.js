import express from 'express';
import {
  getActiveCoupons,
  validateCoupon,
  applyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/coupons
// @desc    Get all active coupons (public)
router.get('/', getActiveCoupons);

// @route   POST /api/coupons/validate
// @desc    Validate coupon code (public)
router.post('/validate', validateCoupon);

// @route   POST /api/coupons/apply
// @desc    Apply coupon to order (authenticated)
router.post('/apply', protect, applyCoupon);

// @route   POST /api/coupons (Admin)
// @desc    Create new coupon
router.post('/', protect, createCoupon);

// @route   PUT /api/coupons/:couponId (Admin)
// @desc    Update coupon
router.put('/:couponId', protect, updateCoupon);

// @route   DELETE /api/coupons/:couponId (Admin)
// @desc    Delete coupon
router.delete('/:couponId', protect, deleteCoupon);

export default router;
