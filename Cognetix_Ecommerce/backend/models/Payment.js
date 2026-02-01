/**
 * Payment Model - Razorpay, Stripe, PayPal, UPI
 */

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'upi', 'netbanking', 'wallet', 'cod'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentId: String, // Gateway payment ID
  status: {
    type: String,
    enum: ['pending', 'initiated', 'authorized', 'captured', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  gatewayResponse: mongoose.Schema.Types.Mixed,
  receipt: String,
  refundId: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'partial', 'full', 'none'],
    default: 'none'
  },
  failureReason: String,
  upiId: String,
  cardDetails: {
    last4: String,
    brand: String,
    expiry: String
  },
  bankDetails: {
    bankName: String,
    accountNumber: String
  },
  wallet: {
    provider: String,
    accountId: String
  },
  metadata: mongoose.Schema.Types.Mixed,
  webhookId: String,
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

export default mongoose.model('Payment', paymentSchema);
