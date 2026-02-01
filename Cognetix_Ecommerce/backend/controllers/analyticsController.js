/**
 * Analytics Controller - Track user behavior, sales, conversions
 */

import Analytics from '../models/Analytics.js';

// Track event
export const trackEvent = async (type, userId = null, data = {}) => {
  try {
    const event = new Analytics({
      type,
      userId,
      productId: data.productId,
      orderId: data.orderId,
      sessionId: data.sessionId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      referrer: data.referrer,
      page: data.page,
      searchQuery: data.searchQuery,
      filters: data.filters,
      deviceType: data.deviceType,
      location: data.location,
      duration: data.duration,
      conversionValue: data.conversionValue,
      metadata: data.metadata
    });

    await event.save();
    return event;
  } catch (error) {
    console.error('Failed to track event:', error);
    throw error;
  }
};

// Get analytics summary
export const getAnalyticsSummary = async (startDate, endDate) => {
  try {
    const dateFilter = { timestamp: { $gte: startDate, $lte: endDate } };

    return {
      totalPageViews: await Analytics.countDocuments({ type: 'page_view', ...dateFilter }),
      totalProductViews: await Analytics.countDocuments({ type: 'product_view', ...dateFilter }),
      totalAddToCart: await Analytics.countDocuments({ type: 'add_to_cart', ...dateFilter }),
      totalCheckouts: await Analytics.countDocuments({ type: 'checkout', ...dateFilter }),
      totalPurchases: await Analytics.countDocuments({ type: 'purchase', ...dateFilter }),
      conversionRate: 0, // Calculate if purchases > 0
      avgSessionDuration: (await Analytics.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, avg: { $avg: '$duration' } } }
      ]))[0]?.avg || 0,
      topSearchQueries: await Analytics.aggregate([
        { $match: { type: 'search', ...dateFilter } },
        { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      topProducts: await Analytics.aggregate([
        { $match: { type: 'product_view', ...dateFilter } },
        { $group: { _id: '$productId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      deviceBreakdown: await Analytics.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } }
      ]),
      locationBreakdown: await Analytics.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$location.country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    };
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    throw error;
  }
};

// Get product analytics
export const getProductAnalytics = async (productId, startDate, endDate) => {
  try {
    const dateFilter = { productId, timestamp: { $gte: startDate, $lte: endDate } };

    return {
      views: await Analytics.countDocuments({ type: 'product_view', ...dateFilter }),
      addToCart: await Analytics.countDocuments({ type: 'add_to_cart', ...dateFilter }),
      purchases: await Analytics.countDocuments({ type: 'purchase', ...dateFilter }),
      reviews: await Analytics.countDocuments({ type: 'review', ...dateFilter }),
      conversionRate: 0, // Calculate from views and purchases
      avgViewDuration: (await Analytics.aggregate([
        { $match: { type: 'product_view', ...dateFilter } },
        { $group: { _id: null, avg: { $avg: '$duration' } } }
      ]))[0]?.avg || 0
    };
  } catch (error) {
    console.error('Failed to fetch product analytics:', error);
    throw error;
  }
};

// Get user analytics
export const getUserAnalytics = async (userId, startDate, endDate) => {
  try {
    const dateFilter = { userId, timestamp: { $gte: startDate, $lte: endDate } };

    return {
      totalEvents: await Analytics.countDocuments({ userId, ...dateFilter }),
      pageViews: await Analytics.countDocuments({ type: 'page_view', ...dateFilter }),
      productViews: await Analytics.countDocuments({ type: 'product_view', ...dateFilter }),
      addToCart: await Analytics.countDocuments({ type: 'add_to_cart', ...dateFilter }),
      purchases: await Analytics.countDocuments({ type: 'purchase', ...dateFilter }),
      totalSpent: (await Analytics.aggregate([
        { $match: { type: 'purchase', ...dateFilter } },
        { $group: { _id: null, total: { $sum: '$conversionValue' } } }
      ]))[0]?.total || 0,
      favoriteProducts: await Analytics.aggregate([
        { $match: { type: 'product_view', ...dateFilter } },
        { $group: { _id: '$productId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    };
  } catch (error) {
    console.error('Failed to fetch user analytics:', error);
    throw error;
  }
};

// Get sales trends
export const getSalesTrends = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.aggregate([
      {
        $match: {
          type: 'purchase',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          sales: { $sum: 1 },
          revenue: { $sum: '$conversionValue' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  } catch (error) {
    console.error('Failed to fetch sales trends:', error);
    throw error;
  }
};

export default {
  trackEvent,
  getAnalyticsSummary,
  getProductAnalytics,
  getUserAnalytics,
  getSalesTrends
};
