/**
 * Home Page
 * Landing page with featured products and hero section
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { FiTruck, FiShield, FiHeadphones, FiCreditCard, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carousel states
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const featuredRef = useRef(null);
  const recentRef = useRef(null);

  // Hero Banner Slides
  const heroSlides = [
    {
      id: 1,
      title: 'Welcome to',
      highlight: 'ShopEase Store',
      description: 'Discover amazing products at unbeatable prices. Shop the latest trends with fast delivery and secure checkout.',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      bgColor: 'from-gray-900 to-gray-800',
      highlightColor: 'text-yellow-400',
    },
    {
      id: 2,
      title: '🔥 Big Sale',
      highlight: 'Up to 50% OFF',
      description: 'Grab the best deals on Electronics, Fashion & more. Limited time offer - Don\'t miss out!',
      buttonText: 'Shop Deals',
      buttonLink: '/products?category=Electronics',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      bgColor: 'from-red-600 to-orange-500',
      highlightColor: 'text-yellow-300',
    },
    {
      id: 3,
      title: 'New Arrivals',
      highlight: 'Fashion Collection',
      description: 'Explore the latest trends in clothing. Fresh styles added daily with exclusive member discounts.',
      buttonText: 'Explore Fashion',
      buttonLink: '/products?category=Clothing',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
      bgColor: 'from-pink-600 to-purple-600',
      highlightColor: 'text-pink-200',
    },
    {
      id: 4,
      title: '⚡ Flash Deal',
      highlight: 'Electronics Fest',
      description: 'Smartphones, Laptops, Gadgets & more at incredible prices. Extra 10% off with code FLASH10.',
      buttonText: 'Grab Now',
      buttonLink: '/products?category=Electronics',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600',
      bgColor: 'from-blue-600 to-cyan-500',
      highlightColor: 'text-cyan-200',
    },
    {
      id: 5,
      title: 'Free Delivery',
      highlight: 'On Orders ₹499+',
      description: 'Shop your favorites and get free shipping on all orders above ₹499. No minimum order for members!',
      buttonText: 'Start Shopping',
      buttonLink: '/products',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
      bgColor: 'from-green-600 to-emerald-500',
      highlightColor: 'text-green-200',
    },
  ];

  // Category images mapping
  const categoryImages = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    'Home & Garden': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    'Sports': 'https://images.unsplash.com/photo-1461896836934- voices-1?w=400',
    'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    'Toys': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
    'Health & Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    'Automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
    'Food & Beverages': 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400',
    'Other': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
  };

  // Category icons/colors
  const categoryStyles = {
    'Electronics': { bg: 'from-blue-500 to-blue-700', icon: '📱' },
    'Clothing': { bg: 'from-pink-500 to-pink-700', icon: '👕' },
    'Home & Garden': { bg: 'from-green-500 to-green-700', icon: '🏠' },
    'Sports': { bg: 'from-orange-500 to-orange-700', icon: '⚽' },
    'Books': { bg: 'from-amber-500 to-amber-700', icon: '📚' },
    'Toys': { bg: 'from-purple-500 to-purple-700', icon: '🧸' },
    'Health & Beauty': { bg: 'from-rose-500 to-rose-700', icon: '💄' },
    'Automotive': { bg: 'from-slate-500 to-slate-700', icon: '🚗' },
    'Food & Beverages': { bg: 'from-red-500 to-red-700', icon: '🍔' },
    'Other': { bg: 'from-gray-500 to-gray-700', icon: '📦' },
  };

  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
    'Toys', 'Health & Beauty', 'Automotive', 'Food & Beverages'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featuredRes = await productsAPI.getFeaturedProducts(12);
        setFeaturedProducts(featuredRes.data || []);

        // Fetch recent products (sorted by newest)
        const recentRes = await productsAPI.getProducts({ limit: 12, sort: '-createdAt' });
        setRecentProducts(recentRes.data || []);

        // Fetch products by category
        const categoryProducts = {};
        const categoryPromises = categories.map(async (category) => {
          try {
            const res = await productsAPI.getProducts({ category, limit: 4 });
            categoryProducts[category] = res.data || [];
          } catch (err) {
            categoryProducts[category] = [];
          }
        });
        
        await Promise.all(categoryPromises);
        setProductsByCategory(categoryProducts);
        
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-slide for Hero Banner
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Auto-slide for Featured Products
  useEffect(() => {
    if (featuredProducts.length <= 4) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % (featuredProducts.length - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  // Auto-slide for Recent Products
  useEffect(() => {
    if (recentProducts.length <= 4) return;
    const interval = setInterval(() => {
      setRecentIndex((prev) => (prev + 1) % (recentProducts.length - 3));
    }, 5000);
    return () => clearInterval(interval);
  }, [recentProducts.length]);

  // Carousel navigation handlers
  const slideFeatured = (direction) => {
    if (direction === 'prev') {
      setFeaturedIndex((prev) => Math.max(0, prev - 1));
    } else {
      setFeaturedIndex((prev) => Math.min(featuredProducts.length - 4, prev + 1));
    }
  };

  const slideRecent = (direction) => {
    if (direction === 'prev') {
      setRecentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setRecentIndex((prev) => Math.min(recentProducts.length - 4, prev + 1));
    }
  };

  const features = [
    {
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'On orders over ₹500',
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: '100% secure payment',
    },
    {
      icon: FiHeadphones,
      title: '24/7 Support',
      description: 'Dedicated support',
    },
    {
      icon: FiCreditCard,
      title: 'Easy Returns',
      description: '7-day return policy',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${heroIndex * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div 
              key={slide.id}
              className={`min-w-full bg-gradient-to-r ${slide.bgColor} text-white`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                      {slide.title}
                      <span className={`block ${slide.highlightColor} mt-1`}>{slide.highlight}</span>
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-white/90">
                      {slide.description}
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Link
                        to={slide.buttonLink}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                      >
                        {slide.buttonText}
                        <FiArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-xl shadow-2xl w-full h-[300px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition z-10"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition z-10"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === heroIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={categoryImages[category]}
                  alt={category}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${categoryStyles[category]?.bg || 'from-gray-500 to-gray-700'} opacity-60 group-hover:opacity-75 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <span className="text-3xl mb-2">{categoryStyles[category]?.icon || '📦'}</span>
                  <h3 className="font-bold text-lg text-center">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                🔥 Featured Products
              </h2>
              <p className="text-gray-500 mt-1">Hand-picked products just for you</p>
            </div>
            <Link
              to="/products?featured=true"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <Loading text="Loading products..." />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          ) : (
            <div className="relative group">
              {/* Left Arrow */}
              <button
                onClick={() => slideFeatured('prev')}
                disabled={featuredIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  ref={featuredRef}
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${featuredIndex * 25}%)` }}
                >
                  {featuredProducts.map((product) => (
                    <div key={product._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Arrow */}
              <button
                onClick={() => slideFeatured('next')}
                disabled={featuredIndex >= featuredProducts.length - 4}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.max(1, featuredProducts.length - 3) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === featuredIndex ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recently Added Carousel Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                ✨ Recently Added
              </h2>
              <p className="text-gray-500 mt-1">Fresh arrivals you might love</p>
            </div>
            <Link
              to="/products?sort=-createdAt"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <Loading text="Loading products..." />
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent products available</p>
            </div>
          ) : (
            <div className="relative group">
              {/* Left Arrow */}
              <button
                onClick={() => slideRecent('prev')}
                disabled={recentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  ref={recentRef}
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${recentIndex * 25}%)` }}
                >
                  {recentProducts.map((product) => (
                    <div key={product._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Arrow */}
              <button
                onClick={() => slideRecent('next')}
                disabled={recentIndex >= recentProducts.length - 4}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.max(1, recentProducts.length - 3) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRecentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === recentIndex ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products by Category Sections */}
      {!loading && !error && categories.map((category) => {
        const products = productsByCategory[category] || [];
        if (products.length === 0) return null;
        
        return (
          <section key={category} className={`py-12 ${categories.indexOf(category) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{categoryStyles[category]?.icon || '📦'}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {category}
                    </h2>
                    <p className="text-gray-500 mt-1">Explore our {category.toLowerCase()} collection</p>
                  </div>
                </div>
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  View All
                  <FiArrowRight className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and discover the best deals on quality products.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Create an Account
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
