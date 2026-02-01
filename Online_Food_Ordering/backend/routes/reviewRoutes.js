import express from "express";
import {
  createReview,
  getItemReviews,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create review
router.post("/", verifyToken, createReview);

// Get reviews for an item
router.get("/item/:itemId", getItemReviews);

// Get all reviews
router.get("/", getAllReviews);

// Delete review
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
