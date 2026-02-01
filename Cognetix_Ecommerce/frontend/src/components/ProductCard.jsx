/**
 * ProductCard Component
 * Displays individual product in a card format
 */

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiCheck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
      return;
    }
    
    const result = await addToCart(product);
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else if (result.requiresAuth) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
  };

  const inCart = isInCart(product._id);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all duration-200 ${
            inCart
              ? 'bg-green-500 text-white'
              : product.stock <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white text-primary-600 hover:bg-primary-600 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          {inCart ? <FiCheck className="w-5 h-5" /> : <FiShoppingCart className="w-5 h-5" />}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="mt-1 text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center mt-2 space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.numReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          
          {product.brand && (
            <span className="text-sm text-gray-500">{product.brand}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
