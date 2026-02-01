import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pizza',
    restaurant: '',
    image: '',
    availability: true,
  });

  const categories = ['Pizza', 'Burger', 'Drinks', 'Dessert', 'Salad', 'Pasta', 'Other'];
  const restaurants = ['Pizza Hut', 'Domino\'s', 'Burger King', 'McDonald\'s', 'Coca Cola', 'Starbucks', 'The Cheesecake Factory', 'Cold Stone', 'Panera Bread', 'Olive Garden'];

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchItems();
  }, [adminToken, navigate]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/menu');
      setItems(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update item
      setItems(items.map(item => 
        item._id === editingId ? { ...item, ...formData } : item
      ));
    } else {
      // Add new item
      const newItem = {
        _id: Date.now().toString(),
        ...formData,
      };
      setItems([...items, newItem]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pizza',
      restaurant: '',
      image: '',
      availability: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item._id !== id));
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 shadow-lg">
        <div className="container px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🍴 Menu Management</h1>
            <p className="text-blue-100">Manage all food items in your restaurant</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 px-4">
        {/* Add Item Button & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search items by name or restaurant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
          >
            {showForm ? '✕ Cancel' : '+ Add New Item'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Item name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                name="restaurant"
                placeholder="Restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                list="restaurants"
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <datalist id="restaurants">
                {restaurants.map(r => <option key={r} value={r} />)}
              </datalist>

              <input
                type="number"
                name="price"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="md:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                className="md:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <label className="font-semibold text-gray-700">Available</label>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No items found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Restaurant</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Price</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.restaurant}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">₹{item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.availability ? '✓ Available' : '✗ Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Items</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{filteredItems.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{filteredItems.filter(i => i.availability).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Unavailable</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{filteredItems.filter(i => !i.availability).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
