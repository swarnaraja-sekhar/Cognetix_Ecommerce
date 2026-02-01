/**
 * Database Seeder
 * Populates the database with sample products and an admin user
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

// Sample Products Data
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    featured: true,
    brand: 'SoundMax',
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with heart rate monitoring, GPS tracking, sleep analysis, and 50+ sport modes. Water resistant up to 50 meters.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 30,
    rating: 4.7,
    numReviews: 256,
    featured: true,
    brand: 'TechGear',
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: '100% organic cotton t-shirt with a comfortable fit. Available in multiple colors. Breathable fabric perfect for everyday wear.',
    price: 799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 100,
    rating: 4.3,
    numReviews: 89,
    featured: false,
    brand: 'ComfortWear',
  },
  {
    name: 'Running Shoes Elite',
    description: 'Lightweight running shoes with advanced cushioning technology. Designed for both casual runners and marathon athletes.',
    price: 3499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 45,
    rating: 4.6,
    numReviews: 312,
    featured: true,
    brand: 'SpeedRunner',
  },
  {
    name: 'Laptop Backpack',
    description: 'Water-resistant laptop backpack with USB charging port. Fits up to 15.6" laptops. Multiple compartments for organized storage.',
    price: 1299,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 75,
    rating: 4.4,
    numReviews: 167,
    featured: false,
    brand: 'TravelPro',
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 599,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 200,
    rating: 4.8,
    numReviews: 445,
    featured: true,
    brand: 'HydroLife',
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    price: 899,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400',
    stock: 60,
    rating: 4.2,
    numReviews: 78,
    featured: false,
    brand: 'ChargeTech',
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface. Perfect for yoga, pilates, and floor exercises. Includes carrying strap.',
    price: 999,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    stock: 80,
    rating: 4.5,
    numReviews: 203,
    featured: false,
    brand: 'ZenFit',
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Mechanical gaming keyboard with customizable RGB lighting, Cherry MX switches, and programmable keys.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
    stock: 25,
    rating: 4.7,
    numReviews: 189,
    featured: true,
    brand: 'GameMaster',
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. Perfect for coffee or tea lovers.',
    price: 699,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    stock: 150,
    rating: 4.4,
    numReviews: 92,
    featured: false,
    brand: 'HomeStyle',
  },
  {
    name: 'Fitness Resistance Bands Set',
    description: 'Complete set of 5 resistance bands with different tension levels. Includes door anchor, handles, and carry bag.',
    price: 799,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
    stock: 90,
    rating: 4.3,
    numReviews: 156,
    featured: false,
    brand: 'FitPro',
  },
  {
    name: 'Desk LED Lamp',
    description: 'Adjustable LED desk lamp with touch control, multiple brightness levels, and color temperatures. USB charging port included.',
    price: 1499,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 40,
    rating: 4.6,
    numReviews: 134,
    featured: true,
    brand: 'LightWorks',
  },
  {
    name: 'Bestseller Novel Collection',
    description: 'Collection of 5 bestselling novels from award-winning authors. Paperback edition with beautiful cover designs.',
    price: 1299,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    stock: 35,
    rating: 4.8,
    numReviews: 287,
    featured: false,
    brand: 'BookWorld',
  },
  {
    name: 'Bluetooth Speaker Portable',
    description: 'Waterproof portable Bluetooth speaker with 360° sound, 12-hour battery, and built-in microphone for calls.',
    price: 1999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 55,
    rating: 4.5,
    numReviews: 234,
    featured: true,
    brand: 'AudioBlast',
  },
  {
    name: 'Skincare Gift Set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Suitable for all skin types.',
    price: 2499,
    category: 'Health & Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    stock: 65,
    rating: 4.6,
    numReviews: 178,
    featured: false,
    brand: 'GlowUp',
  },
  {
    name: 'Kids Building Blocks Set',
    description: '500-piece building blocks set with storage container. Safe, non-toxic materials. Ages 3+.',
    price: 999,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    stock: 70,
    rating: 4.7,
    numReviews: 312,
    featured: true,
    brand: 'PlayTime',
  },
  {
    name: 'Digital Camera DSLR',
    description: 'Professional DSLR camera with 24.2MP sensor, 4K video recording, and interchangeable lens system. Perfect for photographers.',
    price: 45999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    stock: 15,
    rating: 4.8,
    numReviews: 156,
    featured: true,
    brand: 'PhotoPro',
  },
  {
    name: 'Gaming Mouse Wireless',
    description: 'High-precision wireless gaming mouse with 16000 DPI, RGB lighting, and 70-hour battery life. Ergonomic design.',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    stock: 40,
    rating: 4.6,
    numReviews: 234,
    featured: false,
    brand: 'GameMaster',
  },
  {
    name: 'Leather Wallet Men',
    description: 'Genuine leather bifold wallet with RFID blocking technology. Multiple card slots and coin pocket.',
    price: 1299,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    stock: 85,
    rating: 4.4,
    numReviews: 189,
    featured: false,
    brand: 'LeatherCraft',
  },
  {
    name: 'Electric Kettle Smart',
    description: 'Smart electric kettle with temperature control, keep warm function, and 1.7L capacity. BPA-free materials.',
    price: 1899,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 55,
    rating: 4.5,
    numReviews: 145,
    featured: false,
    brand: 'HomeStyle',
  },
  {
    name: 'Dumbbells Adjustable Set',
    description: 'Adjustable dumbbells from 2.5kg to 25kg. Space-saving design with quick weight change mechanism.',
    price: 5999,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    stock: 30,
    rating: 4.7,
    numReviews: 278,
    featured: true,
    brand: 'FitPro',
  },
  {
    name: 'Sunglasses Polarized',
    description: 'Premium polarized sunglasses with UV400 protection. Lightweight titanium frame. Includes hard case.',
    price: 1799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    stock: 120,
    rating: 4.3,
    numReviews: 167,
    featured: false,
    brand: 'SunStyle',
  },
  {
    name: 'Air Purifier HEPA',
    description: 'HEPA air purifier for rooms up to 500 sq ft. Removes 99.97% of airborne particles. Ultra-quiet operation.',
    price: 7999,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
    stock: 25,
    rating: 4.6,
    numReviews: 198,
    featured: true,
    brand: 'CleanAir',
  },
  {
    name: 'Cookbook Collection',
    description: 'Set of 3 international cuisine cookbooks. Over 500 recipes with step-by-step instructions and photos.',
    price: 1599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400',
    stock: 45,
    rating: 4.5,
    numReviews: 123,
    featured: false,
    brand: 'BookWorld',
  },
  {
    name: 'Perfume Gift Set',
    description: 'Luxury perfume collection with 4 signature fragrances. Long-lasting scents for all occasions.',
    price: 3499,
    category: 'Health & Beauty',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    stock: 60,
    rating: 4.7,
    numReviews: 234,
    featured: true,
    brand: 'Fragrance',
  },
  {
    name: 'Board Game Strategy',
    description: 'Award-winning strategy board game for 2-6 players. Ages 10+. Average playtime 60-90 minutes.',
    price: 1299,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400',
    stock: 50,
    rating: 4.8,
    numReviews: 345,
    featured: false,
    brand: 'PlayTime',
  },
  {
    name: 'Car Phone Mount',
    description: 'Universal car phone mount with 360° rotation and one-touch release. Compatible with all smartphones.',
    price: 499,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
    stock: 200,
    rating: 4.2,
    numReviews: 456,
    featured: false,
    brand: 'AutoGear',
  },
  {
    name: 'Protein Powder Whey',
    description: '2kg whey protein powder with 25g protein per serving. Available in chocolate, vanilla, and strawberry.',
    price: 2299,
    category: 'Food & Beverages',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
    stock: 75,
    rating: 4.5,
    numReviews: 567,
    featured: true,
    brand: 'NutriFit',
  },
  {
    name: 'Tablet Stand Adjustable',
    description: 'Aluminum tablet stand with adjustable height and angle. Compatible with tablets 7-13 inches.',
    price: 899,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    stock: 90,
    rating: 4.4,
    numReviews: 189,
    featured: false,
    brand: 'TechGear',
  },
  {
    name: 'Winter Jacket Men',
    description: 'Waterproof winter jacket with thermal insulation. Multiple pockets and detachable hood.',
    price: 4999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    stock: 35,
    rating: 4.6,
    numReviews: 212,
    featured: true,
    brand: 'WinterPro',
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation, transparency mode, and 8-hour battery life. IPX5 water resistant.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    stock: 65,
    rating: 4.7,
    numReviews: 423,
    featured: true,
    brand: 'SoundMax',
  },
  {
    name: 'Instant Pot Duo',
    description: '7-in-1 electric pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6 quart capacity.',
    price: 6999,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    stock: 40,
    rating: 4.8,
    numReviews: 678,
    featured: true,
    brand: 'HomeStyle',
  },
  {
    name: 'Women Sneakers Classic',
    description: 'Classic white sneakers for women with cushioned insole and breathable mesh upper. All-day comfort.',
    price: 2799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    stock: 80,
    rating: 4.5,
    numReviews: 312,
    featured: false,
    brand: 'SpeedRunner',
  },
  {
    name: 'External SSD 1TB',
    description: 'Portable external SSD with 1050MB/s read speed. Shock-resistant and compact design. USB-C compatible.',
    price: 7499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400',
    stock: 30,
    rating: 4.6,
    numReviews: 234,
    featured: false,
    brand: 'TechGear',
  },
  {
    name: 'Essential Oil Diffuser',
    description: 'Ultrasonic aromatherapy diffuser with 7 LED colors and auto shut-off. 300ml capacity for 8+ hours.',
    price: 1299,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
    stock: 95,
    rating: 4.4,
    numReviews: 287,
    featured: false,
    brand: 'ZenLife',
  },
  {
    name: 'Graphic Novel Collection',
    description: 'Box set of 6 bestselling graphic novels. Full-color illustrations. Collector\'s edition.',
    price: 2499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400',
    stock: 25,
    rating: 4.9,
    numReviews: 156,
    featured: true,
    brand: 'BookWorld',
  },
  {
    name: 'Jump Rope Speed',
    description: 'Adjustable speed jump rope with ball bearings for smooth rotation. Includes carrying bag.',
    price: 399,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400',
    stock: 150,
    rating: 4.3,
    numReviews: 189,
    featured: false,
    brand: 'FitPro',
  },
  {
    name: 'Men Formal Shirt',
    description: 'Premium cotton formal shirt with wrinkle-free fabric. Slim fit design. Available in multiple colors.',
    price: 1499,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    stock: 100,
    rating: 4.4,
    numReviews: 234,
    featured: false,
    brand: 'ComfortWear',
  },
  {
    name: 'Smart LED Bulb Pack',
    description: 'Pack of 4 WiFi smart LED bulbs. 16 million colors, voice control compatible. Energy efficient.',
    price: 1999,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    stock: 70,
    rating: 4.5,
    numReviews: 345,
    featured: false,
    brand: 'LightWorks',
  },
  {
    name: 'Makeup Brush Set',
    description: 'Professional 12-piece makeup brush set with synthetic bristles. Includes travel case.',
    price: 999,
    category: 'Health & Beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    stock: 85,
    rating: 4.6,
    numReviews: 278,
    featured: false,
    brand: 'GlowUp',
  },
  {
    name: 'Remote Control Car',
    description: 'High-speed RC car with 2.4GHz remote control. 20km/h speed, rechargeable battery. Ages 6+.',
    price: 1799,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400',
    stock: 45,
    rating: 4.5,
    numReviews: 198,
    featured: true,
    brand: 'PlayTime',
  },
  {
    name: 'Car Dash Camera',
    description: '4K dash camera with night vision, G-sensor, and 170° wide angle. Loop recording and parking mode.',
    price: 3499,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400',
    stock: 35,
    rating: 4.7,
    numReviews: 312,
    featured: true,
    brand: 'AutoGear',
  },
  {
    name: 'Green Tea Organic',
    description: 'Premium organic green tea leaves. 100 tea bags. Rich in antioxidants and natural flavor.',
    price: 599,
    category: 'Food & Beverages',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400',
    stock: 200,
    rating: 4.6,
    numReviews: 456,
    featured: false,
    brand: 'NatureTea',
  },
  {
    name: 'Webcam HD 1080p',
    description: 'Full HD webcam with built-in microphone, auto light correction, and privacy cover. USB plug and play.',
    price: 1999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400',
    stock: 55,
    rating: 4.4,
    numReviews: 267,
    featured: false,
    brand: 'TechGear',
  },
  {
    name: 'Indoor Plant Set',
    description: 'Set of 3 low-maintenance indoor plants with decorative pots. Air-purifying varieties included.',
    price: 1299,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    stock: 40,
    rating: 4.5,
    numReviews: 178,
    featured: false,
    brand: 'GreenLife',
  },
  {
    name: 'Women Handbag Leather',
    description: 'Genuine leather handbag with multiple compartments. Adjustable shoulder strap. Elegant design.',
    price: 3999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    stock: 50,
    rating: 4.7,
    numReviews: 289,
    featured: true,
    brand: 'LeatherCraft',
  },
  {
    name: 'Foam Roller Muscle',
    description: 'High-density foam roller for muscle recovery and deep tissue massage. 45cm length.',
    price: 799,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    stock: 110,
    rating: 4.4,
    numReviews: 234,
    featured: false,
    brand: 'FitPro',
  },
  {
    name: 'Hair Dryer Professional',
    description: 'Ionic hair dryer with 3 heat settings and cool shot button. Includes diffuser and concentrator attachments.',
    price: 2499,
    category: 'Health & Beauty',
    image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400',
    stock: 60,
    rating: 4.5,
    numReviews: 312,
    featured: false,
    brand: 'StylePro',
  },
  {
    name: 'Puzzle 1000 Pieces',
    description: 'Premium 1000-piece jigsaw puzzle with beautiful landscape artwork. Made from recycled materials.',
    price: 699,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=400',
    stock: 75,
    rating: 4.6,
    numReviews: 167,
    featured: false,
    brand: 'PlayTime',
  },
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopease.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create sample user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    // Create products
    await Product.insertMany(sampleProducts);

    console.log('✅ Data Imported Successfully!');
    console.log('');
    console.log('📧 Admin Login:');
    console.log('   Email: admin@shopease.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('📧 User Login:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error.message);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
