/**
 * Notification Routes
 */

import express from 'express';
import {
  sendEmail,
  sendSMS,
  sendPushNotification,
  sendWhatsApp,
  getUserNotifications,
  markAsRead,
  getNotificationStats
} from '../controllers/notificationController.js';

const router = express.Router();

// POST routes
router.post('/email', sendEmail);
router.post('/sms', sendSMS);
router.post('/push', sendPushNotification);
router.post('/whatsapp', sendWhatsApp);
router.post('/:id/mark-read', markAsRead);

// GET routes
router.get('/user/:userId', getUserNotifications);
router.get('/stats', getNotificationStats);

export default router;
