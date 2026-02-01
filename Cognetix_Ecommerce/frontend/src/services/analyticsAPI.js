/**
 * Analytics API Service
 */

import api from './api';

const analyticsAPI = {
  // Track event
  trackEvent: (type, userId = null, data = {}) =>
    api.post('/analytics/track', { type, userId, data }),

  // Track page view
  trackPageView: (page, userId = null, metadata = {}) =>
    api.post('/analytics/track', {
      type: 'page_view',
      userId,
      data: { page, ...metadata }
    }),

  // Track product view
  trackProductView: (productId, duration = 0, metadata = {}) =>
    api.post('/analytics/track', {
      type: 'product_view',
      data: { productId, duration, ...metadata }
    }),

  // Track search
  trackSearch: (searchQuery, results = 0) =>
    api.post('/analytics/track', {
      type: 'search',
      data: { searchQuery, results }
    }),

  // Track add to cart
  trackAddToCart: (productId, quantity = 1) =>
    api.post('/analytics/track', {
      type: 'add_to_cart',
      data: { productId, quantity }
    }),

  // Track purchase
  trackPurchase: (orderId, amount) =>
    api.post('/analytics/track', {
      type: 'purchase',
      data: { orderId, conversionValue: amount }
    }),

  // Get analytics summary
  getAnalyticsSummary: (startDate, endDate) =>
    api.get('/analytics/summary', {
      params: { startDate, endDate }
    }),

  // Get product analytics
  getProductAnalytics: (productId, startDate, endDate) =>
    api.get(`/analytics/product/${productId}`, {
      params: { startDate, endDate }
    }),

  // Get user analytics
  getUserAnalytics: (userId, startDate, endDate) =>
    api.get(`/analytics/user/${userId}`, {
      params: { startDate, endDate }
    }),

  // Get sales trends
  getSalesTrends: (days = 30) =>
    api.get('/analytics/trends', { params: { days } }),

  // Get dashboard metrics
  getDashboardMetrics: () =>
    api.get('/analytics/summary', {
      params: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      }
    })
};

export default analyticsAPI;
