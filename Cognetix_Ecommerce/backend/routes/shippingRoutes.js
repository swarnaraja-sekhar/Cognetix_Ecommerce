/**
 * Shipping Routes
 */

import express from 'express';
import {
  createShipment,
  getTracking,
  updateShippingStatus,
  calculateShippingCost,
  getShippingStats
} from '../controllers/shippingController.js';

const router = express.Router();

// POST routes
router.post('/shipment', createShipment);
router.post('/:id/update-status', updateShippingStatus);
router.post('/calculate-cost', calculateShippingCost);

// GET routes
router.get('/:trackingId/tracking', getTracking);
router.get('/stats', getShippingStats);

export default router;
