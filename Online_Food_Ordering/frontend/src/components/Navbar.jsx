import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 border-b-4 border-blue-800 shadow-2xl">
      <div className="container flex justify-between items-center py-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-3xl">�️</span>
          <span className="text-2xl font-bold text-white drop-shadow-lg">
            DineExpress
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-white font-medium hover:text-yellow-200 transition duration-200">
            Home
          </Link>
          <Link to="/menu" className="text-white font-medium hover:text-yellow-200 transition duration-200">
            Menu
          </Link>

          {token && user && (
            <>
              <Link to="/orders" className="text-white font-medium hover:text-yellow-200 transition duration-200">
                Orders
              </Link>
              <span className="text-sm text-yellow-100 font-semibold px-3 py-1 bg-white/20 rounded-full">
                👤 {user.name}
              </span>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex gap-4 items-center">
          <Link to="/cart" className="relative group">
            <span className="text-2xl hover:scale-110 transition duration-200 text-white">🛒</span>
            {getCartCount() > 0 && (
              <span className="absolute -top-3 -right-3 bg-yellow-400 text-blue-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {getCartCount()}
              </span>
            )}
          </Link>

          {!token ? (
            <>
              <Link to="/login" className="text-white font-semibold px-4 py-2 hover:bg-white/20 rounded-lg transition duration-200">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-yellow-300 shadow-lg transition duration-200">
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="bg-yellow-400 text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-yellow-300 shadow-lg transition duration-200">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
