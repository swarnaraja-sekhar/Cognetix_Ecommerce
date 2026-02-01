/**
 * Navbar Component
 * Modern navigation bar with mega menu, scroll effects, and responsive design
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiSearch,
  FiHome,
  FiGrid,
  FiChevronDown,
  FiHeart,
  FiSettings,
  FiShoppingBag,
  FiBell,
  FiHelpCircle,
  FiPhone,
  FiMoreVertical,
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, switchToSession, getActiveSessions, logoutSession } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Categories with icons and images
  const categories = [
    { name: 'Electronics', icon: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200', items: ['Smartphones', 'Laptops', 'Headphones', 'Cameras'] },
    { name: 'Clothing', icon: '👕', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200', items: ['Men', 'Women', 'Kids', 'Accessories'] },
    { name: 'Home & Garden', icon: '🏠', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200', items: ['Furniture', 'Decor', 'Kitchen', 'Garden'] },
    { name: 'Sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1461896836934- voices-1?w=200', items: ['Fitness', 'Outdoor', 'Team Sports', 'Yoga'] },
    { name: 'Books', icon: '📚', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200', items: ['Fiction', 'Non-Fiction', 'Education', 'Comics'] },
    { name: 'Toys', icon: '🧸', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200', items: ['Action Figures', 'Board Games', 'Puzzles', 'Educational'] },
    { name: 'Health & Beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200', items: ['Skincare', 'Makeup', 'Haircare', 'Wellness'] },
    { name: 'Automotive', icon: '🚗', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200', items: ['Accessories', 'Tools', 'Electronics', 'Care'] },
    { name: 'Food & Beverages', icon: '🍔', image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=200', items: ['Snacks', 'Beverages', 'Organic', 'Supplements'] },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>📞 +91 1234 567 890</span>
            <span>|</span>
            <span>✉️ support@shopease.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>🚚 Free Shipping on orders over ₹500</span>
            <span>|</span>
            <span>🔒 Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all shadow-lg">
                <FiShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-indigo-600">
                  ShopEase
                </span>
                <span className="text-[10px] text-gray-500 -mt-1 hidden sm:block tracking-widest">
                  PREMIUM STORE
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-12 pr-28 py-3 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Home */}
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all ${
                  location.pathname === '/'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <FiHome className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </Link>

              {/* Products Link */}
              <Link
                to="/products"
                className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-all ${
                  location.pathname === '/products'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <FiGrid className="w-4 h-4" />
                <span className="font-medium">Products</span>
              </Link>

              {/* Notification */}
              <div className="relative group">
                <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    3
                  </span>
                </button>
                {/* Notification Dropdown */}
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-2 border-b">
                    <h4 className="font-semibold text-gray-900">Notifications</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b">
                      <p className="text-sm font-medium text-gray-900">🎉 Welcome to ShopEase!</p>
                      <p className="text-xs text-gray-500 mt-1">Get 10% off on your first order</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b">
                      <p className="text-sm font-medium text-gray-900">🔥 Flash Sale Started!</p>
                      <p className="text-xs text-gray-500 mt-1">Up to 50% off on electronics</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">📦 Order Update</p>
                      <p className="text-xs text-gray-500 mt-1">Your recent order is on the way</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg flex items-center space-x-1 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all">
                  <FiHelpCircle className="w-5 h-5" />
                  <span className="font-medium hidden lg:inline">Help</span>
                </button>
                {/* Help Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <a href="tel:+911234567890" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <FiPhone className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">24/7 Helpline</p>
                      <p className="text-xs text-gray-500">+91 1234 567 890</p>
                    </div>
                  </a>
                  <Link to="/help/faq" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">❓</span>
                    <span className="text-sm font-medium">FAQs</span>
                  </Link>
                  <Link to="/help/returns" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">↩️</span>
                    <span className="text-sm font-medium">Returns & Refunds</span>
                  </Link>
                  <Link to="/help/shipping" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">🚚</span>
                    <span className="text-sm font-medium">Shipping Info</span>
                  </Link>
                  <Link to="/help/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">✉️</span>
                    <span className="text-sm font-medium">Contact Us</span>
                  </Link>
                </div>
              </div>

              {/* Wishlist */}
              {isAuthenticated ? (
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all relative group"
                  title="My Wishlist"
                >
                  <FiHeart className="w-5 h-5 group-hover:fill-pink-500" />
                </Link>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all relative group"
                  title="Login to use wishlist"
                >
                  <FiHeart className="w-5 h-5 group-hover:fill-pink-500" />
                </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all relative"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-scale-in">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* More Options Menu (Three Dots) */}
              <div
                className="relative group"
                onMouseEnter={() => setShowMoreMenu(true)}
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
                {/* More Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/deals" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">🔥</span>
                    <span className="text-sm font-medium">Hot Deals</span>
                  </Link>
                  <Link to="/brand-store" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">🏢</span>
                    <span className="text-sm font-medium">Brand Store</span>
                  </Link>
                  <Link to="/compare" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">⚖️</span>
                    <span className="text-sm font-medium">Compare Products</span>
                  </Link>
                  <Link to="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">🎁</span>
                    <span className="text-sm font-medium">Special Offers</span>
                  </Link>
                  <hr className="my-2" />
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <FiSettings className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                  <Link to="/about" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition">
                    <span className="text-lg">ℹ️</span>
                    <span className="text-sm font-medium">About Us</span>
                  </Link>
                </div>
              </div>

              {/* User Menu */}
              {isAuthenticated ? (
                <div
                  className="relative group"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs text-gray-500">Welcome back</p>
                      <p className="text-sm font-semibold text-gray-700 -mt-0.5">
                        {user?.name?.split(' ')[0]}
                      </p>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  <div className={`absolute right-0 mt-0 w-56 bg-white rounded-xl shadow-xl py-2 border z-50 transition-all duration-200 ${
                    showUserMenu
                      ? 'opacity-100 visible top-full'
                      : 'opacity-0 invisible -top-2'
                  }`}>
                    <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {isAdmin ? '👑 Admin Account' : '👤 User Account'}
                      </p>
                    </div>

                    {getActiveSessions().length > 1 && (
                      <>
                        <div className="px-4 py-2 border-b">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Active Sessions ({getActiveSessions().length})</p>
                          {getActiveSessions().map(session => (
                            <div
                              key={session.email}
                              className={`flex items-center justify-between px-2 py-2 rounded text-xs mb-1 cursor-pointer ${
                                session.email === user?.email
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {session.role === 'admin' ? '👑' : '👤'} {session.name}
                              </span>
                              {session.email !== user?.email && (
                                <button
                                  onClick={() => {
                                    switchToSession(session.email);
                                    setShowUserMenu(false);
                                  }}
                                  className="text-primary-600 hover:text-primary-800 font-medium"
                                >
                                  Switch
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                    >
                      <FiPackage className="w-5 h-5" />
                      <span>My Orders</span>
                    </Link>
                    
                    <Link
                      to="/cart"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      <span>My Cart</span>
                      {cartCount > 0 && (
                        <span className="ml-auto bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    {isAdmin && (
                      <>
                        <hr className="my-2" />
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                        >
                          <FiSettings className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </>
                    )}

                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full transition-all"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                    </div>

                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition border border-gray-200 rounded-full hover:border-purple-300 hover:bg-purple-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <Link to="/cart" className="relative p-2">
                <FiShoppingCart className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition"
                >
                  <FiHome className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition"
                >
                  <FiGrid className="w-5 h-5" />
                  <span className="font-medium">All Products</span>
                </Link>

                {/* Mobile Categories */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.name}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition"
                      >
                        <span className="text-2xl mb-1">{category.icon}</span>
                        <span className="text-xs text-gray-600 text-center">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <hr className="my-2" />

                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl mb-2 border border-teal-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
                    >
                      <FiPackage className="w-5 h-5" />
                      <span className="font-medium">My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition"
                      >
                        <FiSettings className="w-5 h-5" />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-center text-purple-600 border-2 border-purple-400 rounded-xl font-medium hover:bg-purple-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-center text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-md"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Flipkart-style Category Bar */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center px-2 sm:px-4 min-w-[70px] sm:min-w-[90px] hover:opacity-80 transition-all"
              >
                {/* Category Image - Square Shape */}
                <div className="w-16 h-16 sm:w-[64px] sm:h-[64px] rounded-lg overflow-hidden mb-2 bg-gray-100 border border-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">${category.icon}</div>`;
                    }}
                  />
                </div>
                {/* Category Name */}
                <span className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-blue-600 text-center leading-tight transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
