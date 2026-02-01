/**
 * Analytics Routes
 */

import express from 'express';
import {
  trackEvent,
  getAnalyticsSummary,
  getProductAnalytics,
  getUserAnalytics,
  getSalesTrends
} from '../controllers/analyticsController.js';

const router = express.Router();

// POST routes - Track events
router.post('/track', async (req, res) => {
  try {
    const event = await trackEvent(req.body.type, req.body.userId, req.body.data);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to track event' });
  }
});

// GET routes - Analytics data
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await getAnalyticsSummary(new Date(startDate), new Date(endDate));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics summary' });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await getProductAnalytics(req.params.productId, new Date(startDate), new Date(endDate));
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product analytics' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await getUserAnalytics(req.params.userId, new Date(startDate), new Date(endDate));
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user analytics' });
  }
});

router.get('/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const trends = await getSalesTrends(parseInt(days));
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales trends' });
  }
});

export default router;
