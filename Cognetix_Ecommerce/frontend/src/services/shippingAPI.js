/**
 * Shipping API Service
 */

import api from './api';

const shippingAPI = {
  // Create shipment
  createShipment: (orderId, shippingDetails) =>
    api.post('/shipping/shipment', { orderId, ...shippingDetails }),

  // Get tracking information
  getTracking: (trackingId) =>
    api.get(`/shipping/${trackingId}/tracking`),

  // Update shipping status
  updateShippingStatus: (shipmentId, status, updates = {}) =>
    api.post(`/shipping/${shipmentId}/update-status`, { status, ...updates }),

  // Calculate shipping cost
  calculateShippingCost: (origin, destination, weight, dimensions = {}) =>
    api.post('/shipping/calculate-cost', { origin, destination, weight, dimensions }),

  // Get shipping statistics
  getShippingStats: () =>
    api.get('/shipping/stats'),

  // Get order shipments
  getOrderShipments: (orderId) =>
    api.get(`/shipping/order/${orderId}`),

  // Get available carriers
  getCarriers: () =>
    api.get('/shipping/carriers'),

  // Get shipping rates
  getShippingRates: (origin, destination, weight) =>
    api.get('/shipping/rates', { params: { origin, destination, weight } }),

  // Cancel shipment
  cancelShipment: (shipmentId, reason = '') =>
    api.post(`/shipping/${shipmentId}/cancel`, { reason }),

  // Get tracking history
  getTrackingHistory: (trackingId) =>
    api.get(`/shipping/${trackingId}/history`)
};

export default shippingAPI;
