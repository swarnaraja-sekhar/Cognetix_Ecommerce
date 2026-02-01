/**
 * Product Details Page
 * Displays detailed information about a single product
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ReviewsSection from '../components/ReviewsSection';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiStar, FiCheck, FiTruck, FiShield, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { wishlistService } from '../services/featureService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getProduct(id);
        setProduct(response.data);
        
        // Check if product is in wishlist
        if (isAuthenticated) {
          try {
            const wishlistCheck = await wishlistService.checkWishlist(id);
            setIsWishlisted(wishlistCheck.success && wishlistCheck.data.isWishlisted);
          } catch (error) {
            console.log('Wishlist check failed silently');
          }
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      setQuantity(1);
    }
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    const result = await addToCart(product, quantity);
    if (result.success) {
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
      // Navigate to cart page after adding
      navigate('/cart');
    } else if (result.requiresAuth) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to buy items');
      navigate('/login', { state: { from: { pathname: `/buy-now/${id}?qty=${quantity}` } } });
      return;
    }

    // Navigate directly to Buy Now page without adding to cart
    navigate(`/buy-now/${id}?qty=${quantity}`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      setLoadingWishlist(true);
      if (isWishlisted) {
        const response = await wishlistService.removeFromWishlist(id);
        if (response.success) {
          setIsWishlisted(false);
          toast.success('Removed from wishlist');
        }
      } else {
        const response = await wishlistService.addToWishlist(id);
        if (response.success) {
          setIsWishlisted(true);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
      console.error(error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image, ...(product.images || [])];
  const inCart = isInCart(product._id);
  const cartQuantity = getItemQuantity(product._id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-primary-600">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-primary-600">
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-gray-500 hover:text-primary-600"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-primary-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                {product.brand && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{product.brand}</span>
                  </>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-500 ml-2">Inclusive of all taxes</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <FiCheck className="w-5 h-5 mr-2" />
                    <span className="font-medium">In Stock</span>
                    {product.stock <= 10 && (
                      <span className="ml-2 text-orange-500">
                        (Only {product.stock} left!)
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-6 py-2 font-medium min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    {inCart && (
                      <span className="text-sm text-primary-600">
                        {cartQuantity} already in cart
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {inCart ? 'Add More' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={loadingWishlist}
                  className={`px-6 py-3 font-semibold rounded-lg transition ${
                    isWishlisted
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50`}
                  title="Add to wishlist"
                >
                  <FiHeart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiTruck className="w-5 h-5 text-primary-600" />
                  <span>Free delivery on orders over ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiShield className="w-5 h-5 text-primary-600" />
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewsSection
            productId={id}
            onRatingUpdate={() => {
              // Refresh product to update rating
              if (product) {
                const fetchUpdated = async () => {
                  try {
                    const response = await productsAPI.getProduct(id);
                    setProduct(response.data);
                  } catch (err) {
                    console.error('Failed to update product rating');
                  }
                };
                fetchUpdated();
              }
            }}
          />
        </div>

        {/* Back to Products */}
        <div className="mt-8">
          <Link
            to="/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
