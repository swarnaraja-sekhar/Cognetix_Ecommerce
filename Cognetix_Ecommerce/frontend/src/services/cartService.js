import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Cart API calls
export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Failed to add to cart' };
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await axios.put(
      `${API_URL}/cart/update/${itemId}`,
      { quantity },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const response = await axios.delete(`${API_URL}/cart/remove/${itemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await axios.delete(`${API_URL}/cart/clear`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
};

export default cartService;
