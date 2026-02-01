/**
 * Payment Routes
 */

import express from 'express';
import {
  initializeRazorpayPayment,
  initializeStripePayment,
  initializeUPIPayment,
  processPaymentWebhook,
  getPaymentDetails,
  refundPayment,
  getPaymentStats
} from '../controllers/paymentController.js';

const router = express.Router();

// POST routes
router.post('/razorpay/initialize', initializeRazorpayPayment);
router.post('/stripe/initialize', initializeStripePayment);
router.post('/upi/initialize', initializeUPIPayment);
router.post('/webhook', processPaymentWebhook);
router.post('/:id/refund', refundPayment);

// GET routes
router.get('/:id', getPaymentDetails);
router.get('/stats', getPaymentStats);

export default router;
