/**
 * Shipping Model - Carrier, tracking, delivery
 */

import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  carrier: {
    type: String,
    enum: ['shiprocket', 'delhivery', 'fedex', 'bluedart', 'custom'],
    required: true
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  awb: String, // Airway bill
  status: {
    type: String,
    enum: ['pending', 'picked', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned', 'cancelled'],
    default: 'pending'
  },
  shippingCost: Number,
  estimatedDelivery: Date,
  actualDelivery: Date,
  pickupDate: Date,
  currentLocation: {
    city: String,
    state: String,
    latitude: Number,
    longitude: Number
  },
  events: [{
    status: String,
    timestamp: Date,
    location: String,
    description: String
  }],
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
    email: String
  },
  carrierResponse: mongoose.Schema.Types.Mixed,
  returnTrackingNumber: String,
  insurance: {
    amount: Number,
    provider: String,
    claimId: String
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Shipping', shippingSchema);
