import express from "express";
import {
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  deleteNotification,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user notifications
router.get("/", verifyToken, getUserNotifications);

// Get unread count
router.get("/unread-count", verifyToken, getUnreadCount);

// Mark as read
router.put("/:notificationId", verifyToken, markAsRead);

// Delete notification
router.delete("/:notificationId", verifyToken, deleteNotification);

export default router;
