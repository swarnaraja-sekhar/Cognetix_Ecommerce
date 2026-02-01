/**
 * Database Reset Script - Removes all users and re-seeds with defaults
 * Run this to start fresh with default admin users
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import seedDatabase from './seedDatabase.js';

dotenv.config();

const resetDatabase = async () => {
  try {
    // Connect to MongoDB using MONGO_URI from .env
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} existing users`);

    // Reseed with default users
    console.log('\n🌱 Seeding database with default admin users...\n');
    await seedDatabase();

    console.log('✅ Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    process.exit(1);
  }
};

resetDatabase();
