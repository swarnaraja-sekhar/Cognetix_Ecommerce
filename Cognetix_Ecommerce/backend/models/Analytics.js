/**
 * Analytics Model - Tracking user behavior, sales, products
 */

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_view', 'product_view', 'add_to_cart', 'checkout', 'purchase', 'search', 'filter', 'review', 'wishlist'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  referrer: String,
  page: String,
  searchQuery: String,
  filters: mongoose.Schema.Types.Mixed,
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop']
  },
  location: {
    country: String,
    state: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  duration: Number, // in seconds
  conversionValue: Number,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('Analytics', analyticsSchema);
