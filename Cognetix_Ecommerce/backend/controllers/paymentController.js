/**
 * Payment Controller - Razorpay, Stripe, PayPal, UPI integration
 */

import Payment from '../models/Payment.js';

// Initialize Razorpay Payment
export const initializeRazorpayPayment = async (orderId, userId, amount) => {
  try {
    // TODO: Integrate with Razorpay SDK
    // const razorpay = new Razorpay({ key_id, key_secret });
    // const options = { amount: amount * 100, currency: 'INR', receipt: orderId };
    // const order = await razorpay.orders.create(options);

    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod: 'razorpay',
      paymentGateway: 'razorpay',
      status: 'initiated'
    });

    await payment.save();
    console.log('💳 Razorpay payment initiated:', { orderId, amount });

    return payment;
  } catch (error) {
    console.error('Failed to initialize Razorpay payment:', error);
    throw error;
  }
};

// Initialize Stripe Payment
export const initializeStripePayment = async (orderId, userId, amount, email) => {
  try {
    // TODO: Integrate with Stripe SDK
    // const stripe = require('stripe')(STRIPE_SECRET);
    // const session = await stripe.checkout.sessions.create({ ... });

    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod: 'stripe',
      paymentGateway: 'stripe',
      status: 'initiated'
    });

    await payment.save();
    console.log('💳 Stripe payment initiated:', { orderId, amount });

    return payment;
  } catch (error) {
    console.error('Failed to initialize Stripe payment:', error);
    throw error;
  }
};

// Initialize UPI Payment
export const initializeUPIPayment = async (orderId, userId, amount, upiId) => {
  try {
    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod: 'upi',
      paymentGateway: 'razorpay', // UPI through Razorpay
      upiId,
      status: 'initiated'
    });

    await payment.save();
    console.log('📱 UPI payment initiated:', { orderId, upiId, amount });

    return payment;
  } catch (error) {
    console.error('Failed to initialize UPI payment:', error);
    throw error;
  }
};

// Process Payment Webhook (from Razorpay, Stripe, etc)
export const processPaymentWebhook = async (webhookData, paymentGateway) => {
  try {
    let paymentId, orderId, status;

    if (paymentGateway === 'razorpay') {
      paymentId = webhookData.payload.payment.entity.id;
      status = webhookData.payload.payment.entity.status === 'captured' ? 'captured' : 'failed';
    } else if (paymentGateway === 'stripe') {
      paymentId = webhookData.data.object.id;
      status = webhookData.data.object.status === 'succeeded' ? 'captured' : 'failed';
    }

    const payment = await Payment.findOneAndUpdate(
      { transactionId: paymentId },
      {
        status,
        gatewayResponse: webhookData,
        updatedAt: new Date()
      },
      { new: true }
    );

    console.log('✅ Payment webhook processed:', { paymentId, status });
    return payment;
  } catch (error) {
    console.error('Failed to process payment webhook:', error);
    throw error;
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  try {
    return await Payment.findById(paymentId);
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    throw error;
  }
};

// Refund payment
export const refundPayment = async (paymentId, refundAmount = null) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    const amount = refundAmount || payment.amount;

    // TODO: Integrate with payment gateway refund API
    // if (payment.paymentGateway === 'razorpay') {
    //   await razorpay.payments.refund(payment.paymentId, { amount: amount * 100 });
    // }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        refundAmount: amount,
        refundStatus: 'pending',
        status: 'refunded'
      },
      { new: true }
    );

    console.log('💰 Refund initiated:', { paymentId, amount });
    return updatedPayment;
  } catch (error) {
    console.error('Failed to refund payment:', error);
    throw error;
  }
};

// Get payment statistics
export const getPaymentStats = async (startDate, endDate) => {
  try {
    return {
      totalPayments: await Payment.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      totalAmount: (await Payment.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'captured' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]))[0]?.total || 0,
      successfulPayments: await Payment.countDocuments({ status: 'captured', createdAt: { $gte: startDate, $lte: endDate } }),
      failedPayments: await Payment.countDocuments({ status: 'failed', createdAt: { $gte: startDate, $lte: endDate } }),
      byGateway: await Payment.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$paymentGateway', count: { $sum: 1 } } }
      ])
    };
  } catch (error) {
    console.error('Failed to fetch payment stats:', error);
    throw error;
  }
};

export default {
  initializeRazorpayPayment,
  initializeStripePayment,
  initializeUPIPayment,
  processPaymentWebhook,
  getPaymentDetails,
  refundPayment,
  getPaymentStats
};
