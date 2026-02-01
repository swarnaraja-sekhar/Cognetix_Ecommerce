import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { wishlistService } from '../services/featureService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState({});

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.success) {
        setWishlistItems(response.data.items || []);
      }
    } catch (error) {
      toast.error('Failed to fetch wishlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        setWishlistItems(wishlistItems.filter((item) => item.productId._id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      console.error(error);
    }
  };

  const addToCart = async (product) => {
    try {
      setLoadingAdd((prev) => ({ ...prev, [product._id]: true }));
      const response = await cartService.addToCart(product._id, 1);
      if (response.success) {
        toast.success('Added to cart');
      } else if (response.message === 'User not authenticated') {
        toast.error('Please login to add items to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    } finally {
      setLoadingAdd((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const clearWishlist = async () => {
    try {
      const response = await wishlistService.clearWishlist();
      if (response.success) {
        setWishlistItems([]);
        toast.success('Wishlist cleared');
      }
    } catch (error) {
      toast.error('Failed to clear wishlist');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <p className="text-gray-600 text-lg mb-6">Your wishlist is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.productId;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="relative overflow-hidden bg-gray-100 h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-500">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.rating && (
                        <span className="flex items-center text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                          ★ {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={loadingAdd[product._id]}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        <FiShoppingCart size={16} />
                        {loadingAdd[product._id] ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
