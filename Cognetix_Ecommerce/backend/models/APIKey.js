/**
 * API Key Model - API authentication and rate limiting
 */

import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  secret: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  permissions: {
    type: [String],
    enum: ['read', 'write', 'delete', 'admin'],
    default: ['read']
  },
  ipWhitelist: [String],
  rateLimit: {
    requests: {
      type: Number,
      default: 1000
    },
    period: {
      type: String,
      enum: ['minute', 'hour', 'day'],
      default: 'hour'
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  lastUsedAt: Date,
  usageStats: {
    totalRequests: {
      type: Number,
      default: 0
    },
    lastMonth: {
      type: Number,
      default: 0
    },
    lastMonthReset: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

export default mongoose.model('APIKey', apiKeySchema);
