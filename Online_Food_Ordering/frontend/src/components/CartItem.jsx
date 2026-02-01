import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="card p-4 flex gap-4 items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-gray-600 text-sm">{item.category}</p>
        <p className="text-primary font-semibold mt-2">₹{item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-bold"
        >
          -
        </button>
        <span className="px-4 py-1 text-center min-w-12 font-semibold">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-bold"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-red-600 hover:text-red-800 text-sm font-semibold mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
