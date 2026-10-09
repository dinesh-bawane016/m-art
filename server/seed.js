const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Artwork = require('./models/Artwork');
const Admin = require('./models/Admin');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // We will clear the seeded data to replace it with accurate titles
    // But we avoid deleting the admin if it already exists to keep credentials safe
    await Artwork.deleteMany({});
    await Order.deleteMany({});
    // We don't delete Users/Admins to preserve your manual accounts
    console.log('🗑️  Cleared seeded Artworks and Orders for re-population');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Ensure Admin exists
    let admin = await Admin.findOne({ email: 'admin@m-art.com' });
    if (!admin) {
      admin = await Admin.create({
        username: 'admin',
        email: 'admin@m-art.com',
        password: hashedPassword
      });
      console.log('👤 Created Admin');
    }

    // 2. Ensure Artists exist (One for each category)
    const artistData = [
      { name: 'Amit Deshmukh', email: 'amit@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Snehal Patil', email: 'snehal@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
      { name: 'Rahul Kulkarni', email: 'rahul@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Anjali Joshi', email: 'anjali@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' },
      { name: 'Sandeep Shinde', email: 'sandeep@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Vikram Pawar', email: 'vikram@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Priya Shinde', email: 'priya@artist.com', role: 'Artist', is_verified: true, avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ];

    const artists = [];
    for (const data of artistData) {
      let artist = await User.findOne({ email: data.email });
      if (!artist) {
        artist = await User.create({ ...data, password: hashedPassword });
      }
      artists.push(artist);
    }

    // 3. Create Artworks with ACCURATE Unsplash-based titles
    const artworksToSeed = [
      // Oil Painting
      { title: 'Abstract Textured Oil Paint', price: 45000, category: 'Oil Painting', image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1000', size: '24x36', artist_id: artists[0]._id },
      { title: 'Classical Still Life with Flowers', price: 38000, category: 'Oil Painting', image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000', size: '20x30', artist_id: artists[0]._id },
      { title: 'Impressionist Forest at Dusk', price: 52000, category: 'Oil Painting', image_url: 'https://images.unsplash.com/photo-1576733175919-ddf604776118?w=1000', size: '30x40', artist_id: artists[0]._id },

      // Digital Art
      { title: 'Fluid Gradient Abstract Shape', price: 12000, category: 'Digital Art', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000', size: '20x20', artist_id: artists[1]._id },
      { title: 'Surreal Cyberpunk Cityscape', price: 15500, category: 'Digital Art', image_url: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1000', size: '24x24', artist_id: artists[1]._id },
      { title: 'Minimalist 3D Geometry', price: 18000, category: 'Digital Art', image_url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1000', size: '18x18', artist_id: artists[1]._id },

      // Watercolour
      { title: 'Soft Watercolour Floral Splash', price: 8500, category: 'Watercolour', image_url: 'https://images.unsplash.com/photo-1541421779221-6f1e0c7079d7?w=1000', size: '12x16', artist_id: artists[2]._id },
      { title: 'Abstract Watercolour Landscape', price: 9200, category: 'Watercolour', image_url: 'https://images.unsplash.com/photo-1525909002-1b057f39dd82?w=1000', size: '14x18', artist_id: artists[2]._id },
      { title: 'Gentle Ocean Waves in Blue', price: 11000, category: 'Watercolour', image_url: 'https://images.unsplash.com/photo-1518998053574-53fd615d9497?w=1000', size: '16x20', artist_id: artists[2]._id },

      // Acrylic
      { title: 'Modern Abstract Acrylic Pour', price: 28000, category: 'Acrylic', image_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1000', size: '24x24', artist_id: artists[3]._id },
      { title: 'Textured Acrylic Brushstrokes', price: 32000, category: 'Acrylic', image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1000', size: '30x30', artist_id: artists[3]._id },
      { title: 'Vibrant Acrylic Colour Palette', price: 25500, category: 'Acrylic', image_url: 'https://images.unsplash.com/photo-1552083974-186346391083?w=1000', size: '20x20', artist_id: artists[3]._id },

      // Mixed Media
      { title: 'Abstract Collage with Textures', price: 19500, category: 'Mixed Media', image_url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000', size: '24x30', artist_id: artists[4]._id },
      { title: 'Handcrafted Paper Art Composition', price: 22000, category: 'Mixed Media', image_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=1000', size: '18x24', artist_id: artists[4]._id },
      { title: 'Mixed Media Industrial Abstract', price: 16500, category: 'Mixed Media', image_url: 'https://images.unsplash.com/photo-1544867885-2333f61544ad?w=1000', size: '20x20', artist_id: artists[4]._id },

      // Sculpture
      { title: 'Classical Stone Bust Sculpture', price: 65000, category: 'Sculpture', image_url: 'https://images.unsplash.com/photo-1567591974574-e852636b14a3?w=1000', size: '15x15x25', artist_id: artists[5]._id },
      { title: 'Minimalist Modern Bronze Statue', price: 48000, category: 'Sculpture', image_url: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=1000', size: '12x12x20', artist_id: artists[5]._id },
      { title: 'Hand-Carved Wooden Figure', price: 55000, category: 'Sculpture', image_url: 'https://images.unsplash.com/photo-1518998053574-53fd615d9497?w=1000', size: '18x18x30', artist_id: artists[5]._id },

      // Photography
      { title: 'Fine Art Nature Landscape', price: 9500, category: 'Photography', image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000', size: '12x18', artist_id: artists[6]._id },
      { title: 'Urban Architecture in Black & White', price: 8200, category: 'Photography', image_url: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=1000', size: '16x24', artist_id: artists[6]._id },
      { title: 'Cinematic Mountain Photography', price: 12500, category: 'Photography', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000', size: '20x30', artist_id: artists[6]._id }
    ];

    await Artwork.insertMany(artworksToSeed);
    console.log('🖼️  Seeded 21 Artworks with accurate Unsplash-based titles');

    console.log('\n🎉 Seed process complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
