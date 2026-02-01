/**
 * Register Page
 * Flipkart-style user registration form
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiShoppingBag, FiPercent, FiHeart, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="w-full max-w-[750px] min-h-[600px] bg-white rounded shadow-lg flex overflow-hidden">
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
            <h2 className="text-[28px] font-medium text-white mb-4">Join ShopEase Today!</h2>
            <p className="text-base text-blue-100 leading-relaxed">
              Create your account and unlock amazing benefits
            </p>
          </div>
          
          {/* Benefits List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <FiPercent className="w-5 h-5" />
              <span className="text-sm">Get 10% off on your first order</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <FiHeart className="w-5 h-5" />
              <span className="text-sm">Save items to your Wishlist</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <FiCreditCard className="w-5 h-5" />
              <span className="text-sm">Quick checkout with saved details</span>
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
            {/* Name Field */}
            <div className="mb-5">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="peer w-full px-0 py-2 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#2874f0] text-gray-900 placeholder-transparent"
                  placeholder="Name"
                />
                <label 
                  htmlFor="name"
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#2874f0]"
                >
                  Enter Full Name
                </label>
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-5">
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
                  Enter Email
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <div className="mb-5">
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="peer w-full px-0 py-2 pr-10 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#2874f0] text-gray-900 placeholder-transparent"
                  placeholder="Confirm Password"
                />
                <label 
                  htmlFor="confirmPassword"
                  className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#2874f0]"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-2 text-gray-400 hover:text-[#2874f0] transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
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

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#fb641b] text-white font-medium rounded-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-shadow"
            >
              {isSubmitting ? 'Creating account...' : 'Continue'}
            </button>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Login Link */}
            <Link 
              to="/login"
              className="block text-center py-3 text-[#2874f0] font-medium hover:underline mt-4"
            >
              Existing User? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
