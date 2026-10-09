/**
 * M-Art Data Migration Script
 * Copies all data from local MongoDB → Atlas
 * Run with: node migrate.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const LOCAL_URI = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/m-art';
const ATLAS_URI = process.env.MONGO_URI || process.env.ATLAS_URI;

if (!ATLAS_URI) {
  console.error('❌ MONGO_URI environment variable is missing.');
  process.exit(1);
}

const COLLECTIONS = ['users', 'artworks', 'orders', 'reviews', 'admins'];

async function migrate() {
  console.log('🚀 Starting M-Art data migration...\n');

  // Connect to local
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('✅ Connected to Local MongoDB');

  // Connect to Atlas
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('✅ Connected to MongoDB Atlas\n');

  for (const collectionName of COLLECTIONS) {
    try {
      const localCollection = localConn.collection(collectionName);
      const atlasCollection = atlasConn.collection(collectionName);

      // Get all docs from local
      const docs = await localCollection.find({}).toArray();

      if (docs.length === 0) {
        console.log(`⚠️  ${collectionName}: empty, skipping.`);
        continue;
      }

      // Clear existing docs in Atlas to avoid duplicates
      await atlasCollection.deleteMany({});

      // Insert into Atlas
      await atlasCollection.insertMany(docs);
      console.log(`✅ ${collectionName}: migrated ${docs.length} documents`);
    } catch (err) {
      console.error(`❌ ${collectionName}: failed — ${err.message}`);
    }
  }

  await localConn.close();
  await atlasConn.close();
  console.log('\n🎉 Migration complete! Your Atlas database is now populated.');
}

migrate().catch(console.error);
