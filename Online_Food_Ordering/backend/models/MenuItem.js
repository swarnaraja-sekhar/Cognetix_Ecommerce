import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a food item name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Pizza", "Burger", "Drinks", "Dessert", "Salad", "Pasta", "Other", "Biryani", "Curry", "Rice", "Bread", "Tandoor", "South Indian", "Appetizer", "Noodles", "Indo-Chinese", "Vegetable", "Chutney"],
    },
    restaurant: {
      type: String,
      required: [true, "Please provide a restaurant name"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Food+Item",
    },
    availability: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
