/**
 * Webhook Routes
 */

import express from 'express';
import {
  subscribeToEvent,
  getWebhooks,
  getWebhookById,
  updateWebhook,
  deleteWebhook,
  getWebhookHistory,
  retryWebhook,
  getWebhookStats
} from '../controllers/webhookController.js';

const router = express.Router();

// POST routes
router.post('/subscribe', subscribeToEvent);
router.post('/:webhookId/retry', retryWebhook);

// GET routes
router.get('/', getWebhooks);
router.get('/stats', getWebhookStats);
router.get('/:id', getWebhookById);
router.get('/:webhookId/history', getWebhookHistory);

// PUT routes
router.put('/:id', updateWebhook);

// DELETE routes
router.delete('/:id', deleteWebhook);

export default router;
