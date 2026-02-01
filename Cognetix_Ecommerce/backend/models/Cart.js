/**
 * Cart Model
 * Handles user-specific shopping cart data
 */

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Calculate cart totals
cartSchema.methods.calculateTotals = function () {
  const subtotal = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingPrice = subtotal > 500 ? 0 : 50;
  const taxRate = 0.18;
  const taxPrice = subtotal * taxRate;
  const total = subtotal + shippingPrice + taxPrice;

  return {
    subtotal,
    shippingPrice,
    taxPrice,
    total,
    itemCount: this.items.reduce((count, item) => count + item.quantity, 0),
  };
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
