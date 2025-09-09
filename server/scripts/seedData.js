const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// Import models
const User = require('../models/User');
const Property = require('../models/Property');

// Mock data from frontend (converted from the client structure)
const mockUsers = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    phone: '+1-555-0123',
    password: 'Password123!',
    role: 'owner',
    provider: 'local',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0124',
    password: 'Password123!',
    role: 'owner',
    provider: 'local',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike@example.com',
    phone: '+1-555-0125',
    password: 'Password123!',
    role: 'owner',
    provider: 'local',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria@example.com',
    phone: '+1-555-0126',
    password: 'Password123!',
    role: 'owner',
    provider: 'local',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david@example.com',
    phone: '+1-555-0127',
    password: 'Password123!',
    role: 'owner',
    provider: 'local',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily@example.com',
    phone: '+1-555-0128',
    password: 'Password123!',
    role: 'owner',
    provider: 'local',
    isVerified: true,
    isActive: true
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: process.env.ADMIN_EMAIL || 'admin@renthome.com',
    phone: '+1-555-0000',
    password: 'AdminPassword123!',
    role: 'admin',
    provider: 'local',
    isVerified: true,
    isActive: true
  }
];

// Mock property data (without images for now - we'll use placeholder URLs)
const mockPropertiesData = [
  {
    title: 'Modern Luxury Apartment',
    description: 'Beautiful contemporary apartment with stunning city views, modern amenities, and excellent location. Perfect for professionals and small families.',
    price: 2500,
    location: {
      address: '123 Downtown Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Air Conditioning', 'Parking', 'Gym', 'Pool', 'Security'],
    isAvailable: true,
    isFeatured: true,
    status: 'approved',
    isVerified: true,
    ownerEmail: 'john@example.com'
  },
  {
    title: 'Charming Family House',
    description: 'Spacious family home with beautiful garden, quiet neighborhood, and excellent schools nearby. Perfect for families with children.',
    price: 3200,
    location: {
      address: '456 Maple Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Garden', 'Garage', 'Air Conditioning', 'Fireplace'],
    isAvailable: true,
    isFeatured: false,
    status: 'approved',
    isVerified: true,
    ownerEmail: 'sarah@example.com'
  },
  {
    title: 'Cozy Studio Downtown',
    description: 'Perfect studio apartment for students or young professionals. Modern design with all amenities included in a prime downtown location.',
    price: 1500,
    location: {
      address: '789 City Center',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    images: [
      'https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2177&q=80'
    ],
    amenities: ['Wi-Fi', 'Air Conditioning', 'Security', 'Laundry'],
    isAvailable: true,
    isFeatured: false,
    status: 'approved',
    isVerified: true,
    ownerEmail: 'mike@example.com'
  },
  {
    title: 'Luxury Villa with Pool',
    description: 'Stunning villa with private pool, Mediterranean architecture, and breathtaking views. Perfect for luxury living and entertaining.',
    price: 5500,
    location: {
      address: '321 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139'
    },
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 4000,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80'
    ],
    amenities: ['Pool', 'Garden', 'Ocean View', 'Security', 'Garage', 'Gym'],
    isAvailable: true,
    isFeatured: true,
    status: 'approved',
    isVerified: true,
    ownerEmail: 'maria@example.com'
  },
  {
    title: 'Modern Condo Complex',
    description: 'Contemporary condominium in a modern building with excellent amenities and city views. Great for urban living.',
    price: 2800,
    location: {
      address: '555 High Rise Blvd',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['City View', 'Gym', 'Concierge', 'Parking', 'Security'],
    isAvailable: true,
    isFeatured: false,
    status: 'approved',
    isVerified: true,
    ownerEmail: 'david@example.com'
  },
  {
    title: 'Historic Townhouse',
    description: 'Charming townhouse in historic district with modern renovations while preserving original character. Walking distance to shops and restaurants.',
    price: 2200,
    location: {
      address: '888 Heritage Lane',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101'
    },
    type: 'townhouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [
      'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    amenities: ['Historic Character', 'Renovated', 'Walking Distance', 'Parking'],
    isAvailable: true,
    isFeatured: false,
    status: 'approved',
    isVerified: true,
    ownerEmail: 'emily@example.com'
  }
];

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Delete existing users except admin
    await User.deleteMany({ role: { $ne: 'admin' } });
    
    const users = [];
    for (const userData of mockUsers) {
      // Hash password before saving
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      users.push(await user.save());
    }
    
    console.log(`✓ Successfully seeded ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedProperties = async (users) => {
  try {
    console.log('Seeding properties...');
    
    // Delete existing properties
    await Property.deleteMany({});
    
    const properties = [];
    
    for (const propertyData of mockPropertiesData) {
      // Find owner by email
      const owner = users.find(u => u.email === propertyData.ownerEmail);
      if (!owner) {
        console.warn(`Owner not found for property: ${propertyData.title}`);
        continue;
      }
      
      const { ownerEmail, ...cleanPropertyData } = propertyData;
      
      const property = new Property({
        ...cleanPropertyData,
        owner: owner._id,
        verificationDate: new Date(),
        verifiedBy: users.find(u => u.role === 'admin')?._id
      });
      
      const savedProperty = await property.save();
      
      // Update owner's properties array
      await User.findByIdAndUpdate(
        owner._id,
        { $push: { properties: savedProperty._id } },
        { runValidators: false }
      );
      
      properties.push(savedProperty);
    }
    
    console.log(`✓ Successfully seeded ${properties.length} properties`);
    return properties;
  } catch (error) {
    console.error('Error seeding properties:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');
    
    const users = await seedUsers();
    const properties = await seedProperties(users);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Seeding Summary:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Properties: ${properties.length}`);
    console.log(`\n🔑 Admin Login:`);
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@renthome.com'}`);
    console.log(`   Password: AdminPassword123!`);
    console.log(`\n🏠 Sample Owner Login:`);
    console.log(`   Email: john@example.com`);
    console.log(`   Password: Password123!`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedProperties };
