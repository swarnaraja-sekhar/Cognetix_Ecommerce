/**
 * Payment API Service
 */

import api from './api';

const paymentAPI = {
  // Initialize Razorpay payment
  initializeRazorpay: (amount, orderId, customerEmail) =>
    api.post('/payments/razorpay/initialize', { amount, orderId, customerEmail }),

  // Initialize Stripe payment
  initializeStripe: (amount, orderId, customerEmail) =>
    api.post('/payments/stripe/initialize', { amount, orderId, customerEmail }),

  // Initialize UPI payment
  initializeUPI: (amount, orderId, upiId) =>
    api.post('/payments/upi/initialize', { amount, orderId, upiId }),

  // Initialize PayPal payment
  initializePayPal: (amount, orderId, returnUrl) =>
    api.post('/payments/paypal/initialize', { amount, orderId, returnUrl }),

  // Process payment webhook
  processWebhook: (webhookData) =>
    api.post('/payments/webhook', webhookData),

  // Get payment details
  getPaymentDetails: (paymentId) =>
    api.get(`/payments/${paymentId}`),

  // Refund payment
  refundPayment: (paymentId, amount = null) =>
    api.post(`/payments/${paymentId}/refund`, { amount }),

  // Get payment statistics
  getPaymentStats: () =>
    api.get('/payments/stats'),

  // Get payment history
  getPaymentHistory: (orderId) =>
    api.get(`/payments/order/${orderId}`),

  // Verify payment
  verifyPayment: (paymentId, signature) =>
    api.post('/payments/verify', { paymentId, signature }),

  // Cancel payment
  cancelPayment: (paymentId, reason = '') =>
    api.post(`/payments/${paymentId}/cancel`, { reason })
};

export default paymentAPI;
