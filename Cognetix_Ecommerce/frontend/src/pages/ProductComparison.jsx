/**
 * Product Comparison Page
 * Compare 2-4 products side by side
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';

const ProductComparison = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const productIds = searchParams.getAll('id');
    if (productIds.length > 0) {
      fetchProducts(productIds);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProducts = async (ids) => {
    try {
      setLoading(true);
      const productsList = await Promise.all(
        ids.map((id) => productsAPI.getProduct(id).then((res) => res.data))
      );
      setProducts(productsList);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim()) {
      try {
        const response = await productsAPI.getProducts({
          search: search.trim(),
          limit: 10,
        });
        setSearchResults(response.data || []);
      } catch (error) {
        toast.error('Search failed');
      }
    }
  };

  const addProduct = (product) => {
    if (products.length < 4) {
      if (!products.find((p) => p._id === product._id)) {
        setProducts([...products, product]);
        setSearch('');
        setSearchResults([]);
        setShowSearch(false);
      } else {
        toast.error('Product already in comparison');
      }
    } else {
      toast.error('Maximum 4 products can be compared');
    }
  };

  const removeProduct = (productId) => {
    setProducts(products.filter((p) => p._id !== productId));
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success('Added to cart');
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
  };

  const specs = [
    { label: 'Category', key: 'category' },
    { label: 'Brand', key: 'brand' },
    { label: 'Price', key: 'price' },
    { label: 'Rating', key: 'rating' },
    { label: 'Stock', key: 'stock' },
    { label: 'Description', key: 'description' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Comparison</h1>
          <p className="text-gray-600">Compare up to 4 products to find the best choice</p>
        </div>

        {/* Add Product Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) {
                  setShowSearch(true);
                }
              }}
              onFocus={() => setShowSearch(true)}
              placeholder="Search products to add..."
              disabled={products.length >= 4}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={products.length >= 4}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              Search
            </button>

            {/* Search Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => addProduct(product)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Comparison Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">Add products to compare</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <tbody>
                {/* Product Header */}
                <tr className="border-b">
                  <td className="w-40 p-4 font-semibold text-gray-900">Product</td>
                  {products.map((product) => (
                    <td
                      key={product._id}
                      className="flex-1 min-w-48 p-4 text-center border-l position-relative"
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => removeProduct(product._id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
                        title="Remove from comparison"
                      >
                        <FiX size={18} />
                      </button>

                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />

                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>

                {/* Specifications */}
                {specs.map((spec) => (
                  <tr key={spec.key} className="border-b hover:bg-gray-50">
                    <td className="w-40 p-4 font-medium text-gray-700 text-sm">
                      {spec.label}
                    </td>
                    {products.map((product) => (
                      <td
                        key={product._id}
                        className="flex-1 min-w-48 p-4 text-center border-l text-sm"
                      >
                        {spec.key === 'price' ? (
                          <span className="font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                        ) : spec.key === 'rating' ? (
                          <div className="flex items-center justify-center gap-2">
                            <StarRating rating={product.rating || 0} interactive={false} />
                            <span className="text-sm text-gray-600">
                              ({product.numReviews || 0})
                            </span>
                          </div>
                        ) : spec.key === 'stock' ? (
                          <span
                            className={
                              product.stock > 0
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {product.stock > 0
                              ? `${product.stock} In Stock`
                              : 'Out of Stock'}
                          </span>
                        ) : spec.key === 'description' ? (
                          <p className="text-gray-600 text-xs line-clamp-3">
                            {product.description}
                          </p>
                        ) : (
                          <span className="text-gray-600">
                            {product[spec.key] || '-'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
