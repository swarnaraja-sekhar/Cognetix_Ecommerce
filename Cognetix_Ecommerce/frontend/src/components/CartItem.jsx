/**
 * CartItem Component
 * Displays individual item in the shopping cart
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Product Image */}
      <Link to={`/products/${item._id}`} className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item._id}`}
          className="text-lg font-semibold text-gray-800 hover:text-primary-600 line-clamp-1"
        >
          {item.name}
        </Link>
        
        <p className="text-primary-600 font-bold mt-1">
          ₹{item.price.toLocaleString('en-IN')}
        </p>

        {/* Mobile: Quantity Controls */}
        <div className="flex items-center gap-2 mt-2 sm:hidden">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => decreaseQuantity(item._id)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-medium">{item.quantity}</span>
            <button
              onClick={() => increaseQuantity(item._id)}
              disabled={item.quantity >= item.stock}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => removeFromCart(item._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop: Quantity Controls */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => decreaseQuantity(item._id)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <FiMinus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-medium min-w-[50px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => increaseQuantity(item._id)}
            disabled={item.quantity >= item.stock}
            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[100px]">
          <p className="text-lg font-bold text-gray-800">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </p>
          {item.quantity > 1 && (
            <p className="text-sm text-gray-500">
              ₹{item.price.toLocaleString('en-IN')} each
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove from cart"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
