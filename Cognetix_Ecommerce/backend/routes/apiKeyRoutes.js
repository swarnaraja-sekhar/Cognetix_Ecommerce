/**
 * API Key Routes
 */

import express from 'express';
import {
  generateAPIKey,
  getAPIKeys,
  getAPIKeyById,
  updateAPIKey,
  deleteAPIKey,
  getAPIKeyStats,
  updateRateLimit,
  rotateAPIKey
} from '../controllers/apiKeyController.js';

const router = express.Router();

// POST routes
router.post('/generate', generateAPIKey);
router.post('/:id/rotate', rotateAPIKey);

// GET routes
router.get('/', getAPIKeys);
router.get('/:id', getAPIKeyById);
router.get('/:id/stats', getAPIKeyStats);

// PUT routes
router.put('/:id', updateAPIKey);
router.put('/:id/rate-limit', updateRateLimit);

// DELETE routes
router.delete('/:id', deleteAPIKey);

export default router;
