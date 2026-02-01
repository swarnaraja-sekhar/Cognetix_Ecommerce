/**
 * Webhook Model - Event subscriptions and webhooks
 */

import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    validate: /^https?:\/\/.+/
  },
  events: {
    type: [String],
    enum: [
      'order.created',
      'order.updated',
      'order.cancelled',
      'payment.completed',
      'payment.failed',
      'product.created',
      'product.updated',
      'product.deleted',
      'user.registered',
      'user.updated',
      'shipment.created',
      'shipment.updated',
      'review.created'
    ],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  secret: {
    type: String,
    required: true
  },
  headers: mongoose.Schema.Types.Mixed,
  retryPolicy: {
    maxRetries: {
      type: Number,
      default: 5
    },
    retryInterval: {
      type: Number,
      default: 300 // seconds
    }
  },
  deliveries: [{
    eventId: String,
    event: String,
    status: String,
    statusCode: Number,
    response: String,
    timestamp: Date,
    retryCount: Number
  }],
  stats: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    successfulDeliveries: {
      type: Number,
      default: 0
    },
    failedDeliveries: {
      type: Number,
      default: 0
    },
    lastDeliveryAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Webhook', webhookSchema);
