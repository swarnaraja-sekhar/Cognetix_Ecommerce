/**
 * Webhook Controller - Manage event subscriptions and deliveries
 */

import Webhook from '../models/Webhook.js';

// Subscribe to event
export const subscribeToEvent = async (req, res) => {
  try {
    const { event, url, secret, retryCount = 3, retryDelay = 300000 } = req.body;

    if (!event || !url) {
      return res.status(400).json({ message: 'Event and URL are required' });
    }

    const webhook = new Webhook({
      event,
      url,
      secret,
      retryPolicy: {
        retryCount,
        retryDelay,
        exponentialBackoff: true
      },
      active: true
    });

    await webhook.save();
    res.status(201).json(webhook);
  } catch (error) {
    console.error('Failed to subscribe to event:', error);
    res.status(500).json({ message: 'Failed to subscribe to event' });
  }
};

// Get all webhooks
export const getWebhooks = async (req, res) => {
  try {
    const webhooks = await Webhook.find();
    res.json(webhooks);
  } catch (error) {
    console.error('Failed to fetch webhooks:', error);
    res.status(500).json({ message: 'Failed to fetch webhooks' });
  }
};

// Get webhook by ID
export const getWebhookById = async (req, res) => {
  try {
    const webhook = await Webhook.findById(req.params.id);
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    res.json(webhook);
  } catch (error) {
    console.error('Failed to fetch webhook:', error);
    res.status(500).json({ message: 'Failed to fetch webhook' });
  }
};

// Update webhook
export const updateWebhook = async (req, res) => {
  try {
    const webhook = await Webhook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    res.json(webhook);
  } catch (error) {
    console.error('Failed to update webhook:', error);
    res.status(500).json({ message: 'Failed to update webhook' });
  }
};

// Delete webhook
export const deleteWebhook = async (req, res) => {
  try {
    const webhook = await Webhook.findByIdAndDelete(req.params.id);
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Failed to delete webhook:', error);
    res.status(500).json({ message: 'Failed to delete webhook' });
  }
};

// Trigger webhook event
export const triggerWebhook = async (event, data) => {
  try {
    const webhooks = await Webhook.find({ event, active: true });

    for (const webhook of webhooks) {
      deliverWebhook(webhook, data);
    }
  } catch (error) {
    console.error('Failed to trigger webhook:', error);
  }
};

// Deliver webhook with retry logic
const deliverWebhook = async (webhook, data) => {
  try {
    // TODO: Implement webhook delivery via HTTP POST
    // const payload = JSON.stringify({ event: webhook.event, data });
    // const signature = generateSignature(payload, webhook.secret);
    // const response = await fetch(webhook.url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Webhook-Signature': signature,
    //     'X-Webhook-ID': webhook._id
    //   },
    //   body: payload
    // });

    const delivery = {
      webhookId: webhook._id,
      event: webhook.event,
      timestamp: new Date(),
      status: 'pending', // Will be 'success' or 'failed'
      statusCode: null,
      response: null,
      nextRetry: new Date(Date.now() + webhook.retryPolicy.retryDelay)
    };

    webhook.deliveryAttempts.push(delivery);
    await webhook.save();

    // TODO: Implement actual HTTP delivery and retry mechanism
    console.log('Webhook delivery queued:', webhook._id, webhook.event);
  } catch (error) {
    console.error('Failed to deliver webhook:', error);
  }
};

// Get webhook delivery history
export const getWebhookHistory = async (req, res) => {
  try {
    const webhook = await Webhook.findById(req.params.webhookId);
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    res.json(webhook.deliveryAttempts);
  } catch (error) {
    console.error('Failed to fetch webhook history:', error);
    res.status(500).json({ message: 'Failed to fetch webhook history' });
  }
};

// Retry failed webhook
export const retryWebhook = async (req, res) => {
  try {
    const webhook = await Webhook.findById(req.params.webhookId);
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }

    // TODO: Implement retry logic
    // Find failed deliveries and retry them

    res.json({ message: 'Webhook retry initiated' });
  } catch (error) {
    console.error('Failed to retry webhook:', error);
    res.status(500).json({ message: 'Failed to retry webhook' });
  }
};

// Get webhook stats
export const getWebhookStats = async (req, res) => {
  try {
    const stats = await Webhook.aggregate([
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$active', 1, 0] } },
          failed: {
            $sum: {
              $size: {
                $filter: {
                  input: '$deliveryAttempts',
                  as: 'attempt',
                  cond: { $eq: ['$$attempt.status', 'failed'] }
                }
              }
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Failed to fetch webhook stats:', error);
    res.status(500).json({ message: 'Failed to fetch webhook stats' });
  }
};

export default {
  subscribeToEvent,
  getWebhooks,
  getWebhookById,
  updateWebhook,
  deleteWebhook,
  triggerWebhook,
  getWebhookHistory,
  retryWebhook,
  getWebhookStats
};
