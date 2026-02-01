import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const FoodDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/menu/${id}`);
        setItem(response.data.data);
      } catch (err) {
        setError('Failed to load food details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light py-12 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-600">{error || 'Food item not found'}</p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary mt-4"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-light py-12">
        <div className="container max-w-2xl">
          <button
            onClick={() => navigate('/menu')}
            className="mb-6 text-primary font-semibold hover:underline"
          >
            ← Back to Menu
          </button>

          <div className="card overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-96 object-cover"
            />

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
                  <p className="text-gray-600 text-sm uppercase font-semibold mb-4">
                    {item.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ₹{item.price.toFixed(2)}
                  </p>
                  {item.availability ? (
                    <span className="text-green-600 font-semibold">Available</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-lg mb-8">{item.description}</p>

              {item.availability && (
                <div className="border-t pt-8">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-bold"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold min-w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded mb-6">
                    <p className="text-gray-600 mb-2">Total Price:</p>
                    <p className="text-3xl font-bold text-primary">
                      ${(item.price * quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    Add {quantity} to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodDetails;
