// Quick seed script - simplified version
import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "./models/MenuItem.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");

    console.log("🧹 Clearing existing menu items...");
    await MenuItem.deleteMany({});
    console.log("✅ Cleared existing data");

    console.log("📝 Adding new items (this may take a moment)...");
    
    const itemsToAdd = [
      // Kaveri Grand - Ongole
      { name: "Chicken Pulao", description: "Fragrant rice cooked with tender chicken and spices", price: 189, category: "Rice", restaurant: "Kaveri Grand - Ongole", image: "https://picsum.photos/500/500?random=81", availability: true },
      { name: "Mixed Veg Pulao", description: "Mixed vegetables with basmati rice and aromatic spices", price: 149, category: "Rice", restaurant: "Kaveri Grand - Ongole", image: "https://picsum.photos/500/500?random=82", availability: true },
      { name: "Biryani Special", description: "House special biryani with meat and fragrant basmati", price: 249, category: "Biryani", restaurant: "Kaveri Grand - Ongole", image: "https://picsum.photos/500/500?random=83", availability: true },
      { name: "Egg Fried Rice", description: "Fried rice with scrambled eggs and vegetables", price: 129, category: "Rice", restaurant: "Kaveri Grand - Ongole", image: "https://picsum.photos/500/500?random=84", availability: true },
      { name: "Tandoori Fish", description: "Fresh fish marinated and grilled in tandoor", price: 279, category: "Tandoor", restaurant: "Kaveri Grand - Ongole", image: "https://picsum.photos/500/500?random=85", availability: true },
      
      // Lakshmi's Pulkapoint - Ongole
      { name: "Butter Pulka", description: "Soft wheat bread puffed and brushed with butter", price: 49, category: "Bread", restaurant: "Lakshmi's Pulkapoint - Ongole", image: "https://picsum.photos/500/500?random=86", availability: true },
      { name: "Masala Pulka", description: "Spicy pulka with cumin and chili powder", price: 59, category: "Bread", restaurant: "Lakshmi's Pulkapoint - Ongole", image: "https://picsum.photos/500/500?random=87", availability: true },
      { name: "Aloo Parantha", description: "Thin bread stuffed with spiced potatoes", price: 69, category: "Bread", restaurant: "Lakshmi's Pulkapoint - Ongole", image: "https://picsum.photos/500/500?random=88", availability: true },
      { name: "Paneer Parantha", description: "Flaky bread stuffed with cottage cheese", price: 79, category: "Bread", restaurant: "Lakshmi's Pulkapoint - Ongole", image: "https://picsum.photos/500/500?random=89", availability: true },
      { name: "Methi Parantha", description: "Whole wheat bread with fresh fenugreek leaves", price: 69, category: "Bread", restaurant: "Lakshmi's Pulkapoint - Ongole", image: "https://picsum.photos/500/500?random=90", availability: true },
    ];

    const result = await MenuItem.insertMany(itemsToAdd);
    console.log(`✅ Added ${result.length} menu items!`);

    console.log("\n✨ Seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  }
};

seedDatabase();
