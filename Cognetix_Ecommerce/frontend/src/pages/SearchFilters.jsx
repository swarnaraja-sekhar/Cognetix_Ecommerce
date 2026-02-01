/**
 * Advanced Search & Filters Page
 * Product search with multiple filters
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

const SearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Available filters
  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports',
    'Books', 'Toys', 'Health & Beauty', 'Automotive', 'Food & Beverages'
  ];

  const brands = [
    'Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas',
    'Puma', 'Levi', 'Tommy Hilfiger', 'Benetton', 'Bosch', 'Philips'
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams, priceRange, selectedCategory, selectedBrand, minRating, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        category: selectedCategory,
        brand: selectedBrand,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minRating,
        sort: sortBy,
        limit: 50,
      };

      const response = await productsAPI.getProducts(params);
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedCategory('');
    setSelectedBrand('');
    setMinRating(0);
    setSortBy('newest');
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery });
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FiSearch size={20} />
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'w-64' : 'w-0'} transition-all overflow-hidden`}>
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiFilter size={20} />
                  Filters
                </h2>
                {(selectedCategory || selectedBrand || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm">₹{priceRange[0].toLocaleString()}</span>
                    <span className="text-sm">-</span>
                    <span className="text-sm">₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer hover:text-blue-500">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                        className="rounded mr-2"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-medium mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center cursor-pointer hover:text-blue-500">
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                        className="rounded mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Rating</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer hover:text-blue-500">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                        className="mr-2"
                      />
                      <div className="flex items-center gap-2">
                        <StarRating rating={rating} interactive={false} size="sm" />
                        <span className="text-sm text-gray-500">{rating}+ stars</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search: "${searchQuery}"` : 'Products'}
                </h1>
                <p className="text-gray-500">{products.length} products found</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                >
                  <FiFilter size={18} />
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
                  >
                    <div className="relative overflow-hidden bg-gray-100 h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-500">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.rating > 0 && (
                          <div className="flex items-center text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                            <span>★</span>
                            <span className="ml-1">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {product.stock > 0 ? (
                        <span className="text-sm text-gray-600">In Stock</span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
