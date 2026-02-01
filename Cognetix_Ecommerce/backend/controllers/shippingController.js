/**
 * Shipping Controller - Shiprocket, Delhivery integration
 */

import Shipping from '../models/Shipping.js';

// Create shipment
export const createShipment = async (orderId, carrier, shippingAddress) => {
  try {
    // TODO: Integrate with Shiprocket API
    // const shiprocket = new Shiprocket(API_TOKEN);
    // const trackingData = await shiprocket.createOrder({ orderId, shippingAddress });

    const shipment = new Shipping({
      orderId,
      carrier,
      status: 'pending',
      shippingAddress,
      pickupDate: new Date()
    });

    await shipment.save();
    console.log('📦 Shipment created:', { orderId, carrier });

    return shipment;
  } catch (error) {
    console.error('Failed to create shipment:', error);
    throw error;
  }
};

// Get real-time tracking
export const getTracking = async (trackingNumber) => {
  try {
    // TODO: Integrate with carrier tracking API
    // const tracking = await shiprocket.getTracking(trackingNumber);

    const shipment = await Shipping.findOne({ trackingNumber });
    if (!shipment) throw new Error('Tracking number not found');

    return {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      currentLocation: shipment.currentLocation,
      estimatedDelivery: shipment.estimatedDelivery,
      events: shipment.events
    };
  } catch (error) {
    console.error('Failed to get tracking:', error);
    throw error;
  }
};

// Update shipping status
export const updateShippingStatus = async (trackingNumber, status, location = null) => {
  try {
    const shipment = await Shipping.findOne({ trackingNumber });
    if (!shipment) throw new Error('Shipment not found');

    shipment.status = status;
    if (location) shipment.currentLocation = location;

    shipment.events.push({
      status,
      timestamp: new Date(),
      location: location?.city || 'Unknown',
      description: `Shipment ${status}`
    });

    if (status === 'delivered') {
      shipment.actualDelivery = new Date();
    }

    await shipment.save();
    console.log('📍 Shipment status updated:', { trackingNumber, status });

    return shipment;
  } catch (error) {
    console.error('Failed to update shipping status:', error);
    throw error;
  }
};

// Calculate shipping cost
export const calculateShippingCost = async (source, destination, weight, dimensions) => {
  try {
    // TODO: Implement shipping cost calculation logic
    // Based on distance, weight, carrier rates, etc.

    const baseCost = 50;
    const weightCharge = (weight || 1) * 10;
    const distanceCharge = Math.random() * 100; // Simplified

    const totalCost = baseCost + weightCharge + distanceCharge;

    return {
      baseCost,
      weightCharge,
      distanceCharge,
      totalCost,
      estimatedDays: Math.ceil(Math.random() * 7) + 1,
      carriers: [
        { name: 'Shiprocket', cost: totalCost, days: 3 },
        { name: 'Delhivery', cost: totalCost + 20, days: 2 },
        { name: 'FedEx', cost: totalCost + 50, days: 1 }
      ]
    };
  } catch (error) {
    console.error('Failed to calculate shipping cost:', error);
    throw error;
  }
};

// Get shipping statistics
export const getShippingStats = async (startDate, endDate) => {
  try {
    return {
      totalShipments: await Shipping.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      delivered: await Shipping.countDocuments({ status: 'delivered', createdAt: { $gte: startDate, $lte: endDate } }),
      inTransit: await Shipping.countDocuments({ status: 'in_transit', createdAt: { $gte: startDate, $lte: endDate } }),
      failed: await Shipping.countDocuments({ status: 'failed', createdAt: { $gte: startDate, $lte: endDate } }),
      avgDeliveryTime: (await Shipping.aggregate([
        {
          $match: { status: 'delivered', createdAt: { $gte: startDate, $lte: endDate } }
        },
        {
          $addFields: {
            deliveryTime: { $subtract: ['$actualDelivery', '$pickupDate'] }
          }
        },
        {
          $group: { _id: null, avg: { $avg: '$deliveryTime' } }
        }
      ]))[0]?.avg / (1000 * 60 * 60 * 24) || 0
    };
  } catch (error) {
    console.error('Failed to fetch shipping stats:', error);
    throw error;
  }
};

export default {
  createShipment,
  getTracking,
  updateShippingStatus,
  calculateShippingCost,
  getShippingStats
};
