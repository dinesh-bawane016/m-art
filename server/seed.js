const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Artwork = require('./models/Artwork');
const Admin = require('./models/Admin');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Artwork.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    await Admin.create({
      username: 'admin',
      email: 'admin@m-art.com',
      password: hashedPassword
    });
    console.log('👤 Created Admin');

    // Create Artists (Maharashtrian Names)
    const artists = await User.insertMany([
      {
        name: 'Amit Deshmukh',
        email: 'amit@artist.com',
        password: hashedPassword,
        role: 'Artist',
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Snehal Patil',
        email: 'snehal@artist.com',
        password: hashedPassword,
        role: 'Artist',
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Rahul Kulkarni',
        email: 'rahul@artist.com',
        password: hashedPassword,
        role: 'Artist',
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Anjali Joshi',
        email: 'anjali@artist.com',
        password: hashedPassword,
        role: 'Artist',
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Sandeep Shinde',
        email: 'sandeep@artist.com',
        password: hashedPassword,
        role: 'Artist',
        is_verified: true,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
      }
    ]);
    console.log('🎨 Created Artists with Maharashtrian names');

    // Create Artworks (Indian Themes)
    await Artwork.insertMany([
      {
        title: 'Morning at Gateway',
        price: 35000,
        category: 'Oil Painting',
        image_url: 'https://images.unsplash.com/photo-1570160897040-30430ae22112?q=80&w=1000&auto=format&fit=crop',
        size: '24 x 36 inches',
        status: 'Available',
        artist_id: artists[0]._id
      },
      {
        title: 'Bazaar Rhythms',
        price: 15000,
        category: 'Photography',
        image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop',
        size: '12 x 18 inches',
        status: 'Available',
        artist_id: artists[1]._id
      },
      {
        title: 'Vibrant Kathakali',
        price: 55000,
        category: 'Oil Painting',
        image_url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1000&auto=format&fit=crop',
        size: '30 x 40 inches',
        status: 'Available',
        artist_id: artists[2]._id
      },
      {
        title: 'Himalayan Echoes',
        price: 28000,
        category: 'Watercolour',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
        size: '18 x 24 inches',
        status: 'Available',
        artist_id: artists[3]._id
      },
      {
        title: 'Cyberpunk Mumbai',
        price: 12000,
        category: 'Digital Art',
        image_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=1000&auto=format&fit=crop',
        size: '20 x 20 inches',
        status: 'Available',
        artist_id: artists[4]._id
      },
      {
        title: 'Ganesha in Stone',
        price: 42000,
        category: 'Sculpture',
        image_url: 'https://images.unsplash.com/photo-1567591974574-e852636b14a3?q=80&w=1000&auto=format&fit=crop',
        size: '15 x 15 x 25 inches',
        status: 'Available',
        artist_id: artists[0]._id
      },
      {
        title: 'Monsoon Chai',
        price: 9000,
        category: 'Photography',
        image_url: 'https://images.unsplash.com/photo-1544787210-2213d84ad960?q=80&w=1000&auto=format&fit=crop',
        size: '10 x 12 inches',
        status: 'Available',
        artist_id: artists[1]._id
      },
      {
        title: 'Mughal Garden',
        price: 65000,
        category: 'Acrylic',
        image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
        size: '36 x 48 inches',
        status: 'Available',
        artist_id: artists[2]._id
      },
      {
        title: 'Abstract Diwali',
        price: 18000,
        category: 'Digital Art',
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
        size: '24 x 24 inches',
        status: 'Available',
        artist_id: artists[3]._id
      },
      {
        title: 'The Sitarist',
        price: 31000,
        category: 'Oil Painting',
        image_url: 'https://images.unsplash.com/photo-1513519247388-4e28347e3223?q=80&w=1000&auto=format&fit=crop',
        size: '24 x 30 inches',
        status: 'Available',
        artist_id: artists[4]._id
      },
      {
        title: 'Rural Tranquility',
        price: 22000,
        category: 'Watercolour',
        image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
        size: '16 x 20 inches',
        status: 'Available',
        artist_id: artists[0]._id
      },
      {
        title: 'Neon Rickshaw',
        price: 11000,
        category: 'Digital Art',
        image_url: 'https://images.unsplash.com/photo-1541339907198-e08756eaaaf8?q=80&w=1000&auto=format&fit=crop',
        size: '20 x 30 inches',
        status: 'Available',
        artist_id: artists[1]._id
      }
    ]);
    console.log('🖼️  Created 12 Artworks with Indian themes');

    // Create a Buyer
    await User.create({
      name: 'Amol Pawar',
      email: 'amol@buyer.com',
      password: hashedPassword,
      role: 'Buyer',
      avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
    });
    console.log('🛒 Created Buyer');

    console.log('\n🎉 Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
