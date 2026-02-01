/**
 * Notification Controller - Send emails, SMS, push, WhatsApp
 */

import Notification from '../models/Notification.js';
import toast from 'react-hot-toast';

// Send Email
export const sendEmail = async (userId, subject, message, templateId = null, variables = {}) => {
  try {
    const notification = new Notification({
      userId,
      type: 'email',
      title: subject,
      message,
      subject,
      templateId,
      variables,
      status: 'pending'
    });

    await notification.save();

    // TODO: Integrate with Nodemailer or SendGrid
    console.log('📧 Email queued:', { subject, userId });

    // Simulate sending
    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    return notification;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Send SMS
export const sendSMS = async (userId, phone, message) => {
  try {
    const notification = new Notification({
      userId,
      type: 'sms',
      message,
      recipient: phone,
      status: 'pending'
    });

    await notification.save();

    // TODO: Integrate with Twilio
    console.log('📱 SMS queued:', { phone, message });

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    return notification;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};

// Send Push Notification
export const sendPushNotification = async (userId, title, message) => {
  try {
    const notification = new Notification({
      userId,
      type: 'push',
      title,
      message,
      status: 'pending'
    });

    await notification.save();

    // TODO: Integrate with Firebase Cloud Messaging
    console.log('🔔 Push notification queued:', { title, userId });

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    return notification;
  } catch (error) {
    console.error('Failed to send push notification:', error);
    throw error;
  }
};

// Send WhatsApp Message
export const sendWhatsApp = async (userId, phone, message) => {
  try {
    const notification = new Notification({
      userId,
      type: 'whatsapp',
      message,
      recipient: phone,
      status: 'pending'
    });

    await notification.save();

    // TODO: Integrate with Twilio WhatsApp API
    console.log('💬 WhatsApp message queued:', { phone, message });

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    return notification;
  } catch (error) {
    console.error('Failed to send WhatsApp:', error);
    throw error;
  }
};

// Get user notifications
export const getUserNotifications = async (userId) => {
  try {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { status: 'read', readAt: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

// Get notification statistics
export const getNotificationStats = async () => {
  try {
    return {
      total: await Notification.countDocuments(),
      sent: await Notification.countDocuments({ status: 'sent' }),
      pending: await Notification.countDocuments({ status: 'pending' }),
      failed: await Notification.countDocuments({ status: 'failed' }),
      byType: await Notification.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    };
  } catch (error) {
    console.error('Failed to fetch notification stats:', error);
    throw error;
  }
};

export default {
  sendEmail,
  sendSMS,
  sendPushNotification,
  sendWhatsApp,
  getUserNotifications,
  markAsRead,
  getNotificationStats
};
