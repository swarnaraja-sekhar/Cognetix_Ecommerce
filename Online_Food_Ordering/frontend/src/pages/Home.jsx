import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  const categories = ['Pizza', 'Burger', 'Drinks', 'Dessert', 'Salad', 'Pasta', 'Other'];

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await api.get('/menu');
        setItems(response.data.data);
        setFilteredItems(response.data.data);
        
        // Extract unique restaurants
        const uniqueRestaurants = [...new Set(response.data.data.map(item => item.restaurant))];
        setRestaurants(uniqueRestaurants.sort());
      } catch (err) {
        setError('Failed to load menu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter items
  useEffect(() => {
    let filtered = items;

    if (selectedRestaurant) {
      filtered = filtered.filter((item) => item.restaurant === selectedRestaurant);
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedRestaurant, selectedCategory, searchTerm, items]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-light text-dark">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          
          <div className="container relative z-10">
            <div className="text-center space-y-8">
              {/* Emoji & Badge */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-6xl animate-bounce">🍕</span>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm">
                  🚀 Fast Delivery Service
                </span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Order Food Online
                  </span>
                  <br />
                  <span className="text-dark">Get it Delivered Fresh</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover a wide variety of delicious meals from your favorite restaurants. 
                Fast delivery, quality food, and amazing prices—all in one place.
              </p>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 py-4 max-w-3xl mx-auto">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">⚡</span>
                  <span className="font-semibold text-dark">Quick Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">👨‍🍳</span>
                  <span className="font-semibold text-dark">Quality Food</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">💰</span>
                  <span className="font-semibold text-dark">Best Prices</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/menu" className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 text-lg">
                  <span className="flex items-center justify-center gap-2">
                    🛒 Order Now
                  </span>
                </Link>
                <Link to="/register" className="group px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition duration-300 transform hover:scale-105 text-lg">
                  <span className="flex items-center justify-center gap-2">
                    ✨ Create Account
                  </span>
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="pt-4">
                <p className="text-sm text-gray-500 font-medium">
                  ⭐ Trusted by 10,000+ customers | 🌍 Available in your area
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 text-dark py-20">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-8 text-center bg-white border-2 border-emerald-200 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-2 text-emerald-700">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your food delivered quickly with our efficient delivery system
                </p>
              </div>

              <div className="card p-8 text-center bg-white border-2 border-teal-200 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold mb-2 text-teal-700">Fresh Food</h3>
                <p className="text-gray-600">
                  All our food is prepared fresh with the highest quality ingredients
                </p>
              </div>

              <div className="card p-8 text-center bg-white border-2 border-cyan-200 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-700">Easy Payment</h3>
                <p className="text-gray-600">
                  Multiple payment options available for your convenience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All Items Section */}
        <section className="bg-light text-dark py-20">
          <div className="container">
            <h2 className="text-4xl font-bold mb-8">🍔 Browse Restaurants</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Search Box */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search by food name, restaurant, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">Filter by Category:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    selectedCategory === ''
                      ? 'bg-primary text-white'
                      : 'bg-white text-dark border border-gray-300 hover:border-primary'
                  }`}
                >
                  All Categories
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark border border-gray-300 hover:border-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Items by Restaurant */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading restaurants...</p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No restaurants available</p>
              </div>
            ) : (
              <div className="space-y-12">
                {restaurants
                  .filter((restaurant) =>
                    selectedRestaurant === '' || selectedRestaurant === restaurant
                  )
                  .map((restaurant) => {
                    const restaurantItems = filteredItems.filter(
                      (item) => item.restaurant === restaurant
                    );

                    if (restaurantItems.length === 0) return null;

                    return (
                      <div key={restaurant} className="bg-white rounded-lg overflow-hidden shadow-lg">
                        {/* Restaurant Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                          <h3 className="text-3xl font-bold mb-2">{restaurant}</h3>
                          <p className="text-sm opacity-90">
                            {restaurantItems.length} items available
                          </p>
                        </div>

                        {/* Restaurant Items Grid */}
                        <div className="p-8">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {restaurantItems.map((item) => (
                              <FoodCard key={item._id} item={item} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {!loading && filteredItems.length === 0 && restaurants.length > 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No items found matching your search and filters
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse our menu and place your first order today!
          </p>
          <Link to="/menu" className="btn-primary px-8 py-3 text-lg inline-block">
            Browse Full Menu
          </Link>
        </section>

        {/* Admin Portal Link */}
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
          <div className="container flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🛡️ Restaurant Admin Portal</h2>
              <p className="text-gray-300 mt-2">Manage your menu, orders, and analytics in one place</p>
            </div>
            <Link to="/admin/login" className="bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition transform hover:scale-105 text-lg">
              Admin Login →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
