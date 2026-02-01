import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to wishlist
router.post("/", verifyToken, addToWishlist);

// Get wishlist
router.get("/", verifyToken, getWishlist);

// Check if item in wishlist
router.get("/check/:itemId", verifyToken, isInWishlist);

// Remove from wishlist
router.delete("/:itemId", verifyToken, removeFromWishlist);

export default router;
