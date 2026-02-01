/**
 * Cart Context
 * Manages shopping cart state across the application
 * User-specific cart - requires authentication
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(50);
  const [taxPrice, setTaxPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Get auth data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Fetch cart from server when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated && user) {
        try {
          setLoading(true);
          const response = await cartAPI.getCart();
          if (response.success) {
            // Map backend items to frontend format (product -> _id)
            const items = response.data.items.map(item => ({
              _id: item.product.toString(),
              name: item.name,
              price: item.price,
              image: item.image,
              stock: item.stock,
              quantity: item.quantity,
            }));
            setCartItems(items);
            setCartCount(response.data.itemCount || 0);
            setSubtotal(response.data.subtotal || 0);
            setShippingPrice(response.data.shippingPrice || 50);
            setTaxPrice(response.data.taxPrice || 0);
            setTotal(response.data.total || 0);
          }
        } catch (err) {
          console.error('Failed to fetch cart:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Clear cart when user logs out
        setCartItems([]);
        setCartCount(0);
        setSubtotal(0);
        setShippingPrice(50);
        setTaxPrice(0);
        setTotal(0);
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Update cart state from API response
  const updateCartState = (data) => {
    const items = data.items.map(item => ({
      _id: item.product.toString(),
      name: item.name,
      price: item.price,
      image: item.image,
      stock: item.stock,
      quantity: item.quantity,
    }));
    setCartItems(items);
    setCartCount(data.itemCount || 0);
    setSubtotal(data.subtotal || 0);
    setShippingPrice(data.shippingPrice || 50);
    setTaxPrice(data.taxPrice || 0);
    setTotal(data.total || 0);
  };

  // Add item to cart (requires authentication)
  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, requiresAuth: true };
    }

    try {
      const response = await cartAPI.addToCart(product._id, quantity);
      if (response.success) {
        updateCartState(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }, [isAuthenticated]);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.success) {
        updateCartState(response.data);
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  }, [isAuthenticated]);

  // Update item quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      if (response.success) {
        updateCartState(response.data);
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  }, [isAuthenticated]);

  // Increase quantity by 1
  const increaseQuantity = useCallback(async (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    if (item && item.quantity < item.stock) {
      await updateQuantity(productId, item.quantity + 1);
    }
  }, [cartItems, updateQuantity]);

  // Decrease quantity by 1
  const decreaseQuantity = useCallback(async (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    if (item) {
      if (item.quantity <= 1) {
        await removeFromCart(productId);
      } else {
        await updateQuantity(productId, item.quantity - 1);
      }
    }
  }, [cartItems, updateQuantity, removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.clearCart();
      if (response.success) {
        setCartItems([]);
        setCartCount(0);
        setSubtotal(0);
        setShippingPrice(50);
        setTaxPrice(0);
        setTotal(50);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [isAuthenticated]);

  // Check if item is in cart
  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item._id === productId),
    [cartItems]
  );

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((i) => i._id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const value = {
    cartItems,
    cartCount,
    subtotal,
    shippingPrice,
    taxPrice,
    total,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    isAuthenticated,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
