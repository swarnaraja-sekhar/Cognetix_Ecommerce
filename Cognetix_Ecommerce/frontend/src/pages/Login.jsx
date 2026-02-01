/**
 * Login Page
 * Flipkart-style user authentication form
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiShoppingBag, FiTruck, FiShield, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="w-full max-w-[750px] min-h-[528px] bg-white rounded shadow-lg flex overflow-hidden">
        {/* Left Side - Blue Panel */}
        <div className="hidden md:flex md:w-[40%] bg-gradient-to-b from-[#2874f0] to-[#1a5dc8] p-10 flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FiShoppingBag className="w-6 h-6 text-[#2874f0]" />
              </div>
              <span className="text-2xl font-bold text-white">ShopEase</span>
            </div>
            <h2 className="text-[28px] font-medium text-white mb-4">Welcome Back!</h2>
            <p className="text-base text-blue-100 leading-relaxed">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          
          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <FiTruck className="w-5 h-5" />
              <span className="text-sm">Free Delivery on orders above ₹499</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <FiShield className="w-5 h-5" />
              <span className="text-sm">100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <FiGift className="w-5 h-5" />
              <span className="text-sm">Exclusive Member Rewards</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-10 flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#2874f0] rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <Link to="/" className="text-[#2874f0] text-2xl font-bold">
              ShopEase
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Email Field */}
            <div className="mb-6">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full px-0 py-2 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#2874f0] text-gray-900 placeholder-transparent"
                  placeholder="Email"
                />
                <label 
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#2874f0]"
                >
                  Enter Email/Mobile number
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="peer w-full px-0 py-2 pr-10 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#2874f0] text-gray-900 placeholder-transparent"
                  placeholder="Password"
                />
                <label 
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#2874f0]"
                >
                  Enter Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2 text-gray-400 hover:text-[#2874f0] transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Text */}
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              By continuing, you agree to ShopEase's{' '}
              <a href="#" className="text-[#2874f0] hover:underline">Terms of Use</a>
              {' '}and{' '}
              <a href="#" className="text-[#2874f0] hover:underline">Privacy Policy</a>.
            </p>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#fb641b] text-white font-medium rounded-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-shadow"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            {/* OR Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-sm text-gray-500">OR</span>
              </div>
            </div>

            {/* OTP Button (Demo accounts) */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@shopease.com', password: 'admin123' })}
                className="w-full py-3 border border-gray-300 text-[#2874f0] font-medium rounded-sm hover:border-[#2874f0] transition-colors text-sm"
              >
                Quick Login as Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'john@example.com', password: 'password123' })}
                className="w-full py-3 border border-gray-300 text-[#2874f0] font-medium rounded-sm hover:border-[#2874f0] transition-colors text-sm"
              >
                Quick Login as User
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Register Link */}
            <Link 
              to="/register"
              className="block text-center py-3 text-[#2874f0] font-medium hover:underline"
            >
              New to ShopEase? Create an account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
