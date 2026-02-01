import express from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
// @route   GET /api/menu
// @desc    Get all food items
router.get("/", getAllMenuItems);

// @route   GET /api/menu/:id
// @desc    Get single food item
router.get("/:id", getMenuItemById);

// Protected routes (Admin only)
// @route   POST /api/menu
// @desc    Create menu item
router.post("/", verifyToken, verifyAdmin, createMenuItem);

// @route   PUT /api/menu/:id
// @desc    Update menu item
router.put("/:id", verifyToken, verifyAdmin, updateMenuItem);

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
router.delete("/:id", verifyToken, verifyAdmin, deleteMenuItem);

export default router;
