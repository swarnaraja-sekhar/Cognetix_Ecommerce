/**
 * Webhook API Service
 */

import api from './api';

const webhookAPI = {
  // Subscribe to event
  subscribeToEvent: (event, url, secret = null) =>
    api.post('/webhooks/subscribe', { event, url, secret }),

  // Get all webhooks
  getWebhooks: () =>
    api.get('/webhooks'),

  // Get webhook by ID
  getWebhookById: (webhookId) =>
    api.get(`/webhooks/${webhookId}`),

  // Update webhook
  updateWebhook: (webhookId, updates) =>
    api.put(`/webhooks/${webhookId}`, updates),

  // Delete webhook
  deleteWebhook: (webhookId) =>
    api.delete(`/webhooks/${webhookId}`),

  // Get webhook history
  getWebhookHistory: (webhookId) =>
    api.get(`/webhooks/${webhookId}/history`),

  // Retry webhook
  retryWebhook: (webhookId) =>
    api.post(`/webhooks/${webhookId}/retry`),

  // Get webhook statistics
  getWebhookStats: () =>
    api.get('/webhooks/stats'),

  // Get failed deliveries
  getFailedDeliveries: (webhookId) =>
    api.get(`/webhooks/${webhookId}/failed`),

  // Pause webhook
  pauseWebhook: (webhookId) =>
    api.put(`/webhooks/${webhookId}`, { active: false }),

  // Resume webhook
  resumeWebhook: (webhookId) =>
    api.put(`/webhooks/${webhookId}`, { active: true })
};

export default webhookAPI;
