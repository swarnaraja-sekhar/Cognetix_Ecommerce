import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews/:productId
// @desc    Get reviews for a product
router.get('/:productId', getProductReviews);

// @route   POST /api/reviews/:productId
// @desc    Create a review for a product
router.post('/:productId', protect, createReview);

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
router.put('/:reviewId', protect, updateReview);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
router.delete('/:reviewId', protect, deleteReview);

// @route   POST /api/reviews/:reviewId/helpful
// @desc    Mark review as helpful or unhelpful
router.post('/:reviewId/helpful', protect, markHelpful);

export default router;
