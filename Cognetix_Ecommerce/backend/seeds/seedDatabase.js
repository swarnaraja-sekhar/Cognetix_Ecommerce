/**
 * Database Seeding - Creates default admin and test users
 */

import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedDatabase = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('✅ Admin user already exists. Skipping seed.');
      return;
    }

    console.log('🌱 Seeding database with default users...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);

    // Default users to create
    const defaultUsers = [
      {
        name: 'Shop Admin',
        email: 'admin@shopease.com',
        password: adminPassword,
        role: 'admin',
        address: {
          street: '123 Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          zipCode: '100001',
          country: 'India'
        }
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        address: {
          street: '456 Shop Lane',
          city: 'Shop City',
          state: 'Shop State',
          zipCode: '100002',
          country: 'India'
        }
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'user',
        address: {
          street: '789 Customer St',
          city: 'Customer City',
          state: 'Customer State',
          zipCode: '100003',
          country: 'India'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        role: 'user',
        address: {
          street: '321 User Avenue',
          city: 'User City',
          state: 'User State',
          zipCode: '100004',
          country: 'India'
        }
      }
    ];

    // Insert default users
    const createdUsers = await User.insertMany(defaultUsers);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Default Users Created:');
    console.log('\n🔐 ADMIN ACCOUNTS:');
    console.log('   1. Email: admin@shopease.com | Password: Admin@123');
    console.log('   2. Email: admin@example.com  | Password: Admin@123');
    console.log('\n👤 TEST USERS:');
    console.log('   1. Email: john@example.com   | Password: User@123');
    console.log('   2. Email: jane@example.com   | Password: User@123');
    console.log('\n💡 Use admin accounts to access the dashboard at /admin\n');

    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    // Don't throw - let server continue even if seed fails
  }
};

export default seedDatabase;
