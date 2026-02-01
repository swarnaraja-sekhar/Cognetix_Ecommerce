import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Wishlist API calls
export const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    const response = await axios.post(
      `${API_URL}/wishlist`,
      { productId },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Check if product is in wishlist
  checkWishlist: async (productId) => {
    const response = await axios.get(`${API_URL}/wishlist/check/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await axios.delete(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
};

// Review API calls
export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId, page = 1, limit = 5) => {
    const response = await axios.get(
      `${API_URL}/reviews/${productId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Create a review
  createReview: async (productId, reviewData) => {
    const response = await axios.post(`${API_URL}/reviews/${productId}`, reviewData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, updateData) => {
    const response = await axios.put(`${API_URL}/reviews/${reviewId}`, updateData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (reviewId, isHelpful) => {
    const response = await axios.post(
      `${API_URL}/reviews/${reviewId}/helpful`,
      { isHelpful },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  },
};

// Coupon API calls
export const couponService = {
  // Get all active coupons
  getActiveCoupons: async () => {
    const response = await axios.get(`${API_URL}/coupons`);
    return response.data;
  },

  // Validate coupon code
  validateCoupon: async (code, orderAmount) => {
    const response = await axios.post(`${API_URL}/coupons/validate`, {
      code,
      orderAmount,
    });
    return response.data;
  },

  // Apply coupon to order
  applyCoupon: async (code, orderAmount) => {
    const response = await axios.post(
      `${API_URL}/coupons/apply`,
      { code, orderAmount },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  },

  // Create coupon (Admin)
  createCoupon: async (couponData) => {
    const response = await axios.post(`${API_URL}/coupons`, couponData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Update coupon (Admin)
  updateCoupon: async (couponId, updateData) => {
    const response = await axios.put(`${API_URL}/coupons/${couponId}`, updateData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Delete coupon (Admin)
  deleteCoupon: async (couponId) => {
    const response = await axios.delete(`${API_URL}/coupons/${couponId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
};
