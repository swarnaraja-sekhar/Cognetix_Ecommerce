import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
router.get('/', getWishlist);

// @route   POST /api/wishlist
// @desc    Add product to wishlist
router.post('/', addToWishlist);

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
router.get('/check/:productId', checkWishlist);

// @route   DELETE /api/wishlist
// @desc    Clear entire wishlist
router.delete('/', clearWishlist);

export default router;
