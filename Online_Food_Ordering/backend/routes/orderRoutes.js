import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (User)
// @route   POST /api/orders
// @desc    Create a new order
router.post("/", verifyToken, createOrder);

// @route   GET /api/orders/my
// @desc    Get user's orders (MUST BE BEFORE /:id)
router.get("/my", verifyToken, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order details
router.get("/:id", verifyToken, getOrderById);

// Protected routes (Admin)
// @route   PUT /api/orders/:id/status
// @desc    Update order status
router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

// @route   GET /api/orders (Admin only - but placed at end to not conflict with /my)
router.get("/", verifyToken, verifyAdmin, getAllOrders);

export default router;
