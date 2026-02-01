import express from "express";
import {
  createCoupon,
  validateCoupon,
  getAllCoupons,
  deleteCoupon,
} from "../controllers/couponController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create coupon (Admin)
router.post("/", verifyToken, createCoupon);

// Validate coupon
router.post("/validate", validateCoupon);

// Get all coupons
router.get("/", getAllCoupons);

// Delete coupon (Admin)
router.delete("/:couponId", verifyToken, deleteCoupon);

export default router;
