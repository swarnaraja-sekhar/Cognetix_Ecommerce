/**
 * Notification API Service
 */

import api from './api';

const notificationAPI = {
  // Send email notification
  sendEmail: (to, subject, body, template = null) =>
    api.post('/notifications/email', { to, subject, body, template }),

  // Send SMS notification
  sendSMS: (phoneNumber, message) =>
    api.post('/notifications/sms', { phoneNumber, message }),

  // Send push notification
  sendPushNotification: (userId, title, message, data = {}) =>
    api.post('/notifications/push', { userId, title, message, data }),

  // Send WhatsApp message
  sendWhatsApp: (phoneNumber, message, mediaUrl = null) =>
    api.post('/notifications/whatsapp', { phoneNumber, message, mediaUrl }),

  // Get user notifications
  getUserNotifications: (userId) =>
    api.get(`/notifications/user/${userId}`),

  // Mark notification as read
  markAsRead: (notificationId) =>
    api.post(`/notifications/${notificationId}/mark-read`),

  // Get notification statistics
  getNotificationStats: () =>
    api.get('/notifications/stats'),

  // Get unread notifications count
  getUnreadCount: (userId) =>
    api.get(`/notifications/user/${userId}`).then(res => 
      res.data.filter(n => !n.read).length
    ),

  // Subscribe to notifications
  subscribeToNotifications: (userId, preferences) =>
    api.post('/notifications/subscribe', { userId, preferences }),

  // Update notification preferences
  updatePreferences: (userId, preferences) =>
    api.put(`/notifications/${userId}/preferences`, { preferences })
};

export default notificationAPI;
