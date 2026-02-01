import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-gray-200 hover:border-primary">
      {/* Image Container */}
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-200 to-slate-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
          ₹{item.price}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          {item.availability ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              ✓ Available
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Category Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-dark px-3 py-1 rounded-full text-xs font-bold uppercase">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col h-full">
        {/* Restaurant Name */}
        <p className="text-primary text-xs font-bold uppercase tracking-wide mb-2">
          {item.restaurant}
        </p>

        {/* Food Name */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {item.description}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4 mt-2">
          {/* Button Group */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!item.availability}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary text-sm"
            >
              🛒 Add
            </button>
            <Link
              to={`/food/${item._id}`}
              className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 text-center text-sm"
            >
              👁️ View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
