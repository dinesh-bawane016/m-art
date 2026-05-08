/**
 * M-Art Data Migration Script
 * Copies all data from local MongoDB → Atlas
 * Run with: node migrate.js
 */
const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://localhost:27017/m-art';
const ATLAS_URI = 'mongodb+srv://dineshUser:9WEir7sOWw8a9SzO@cluster0.r3kgsel.mongodb.net/m-art?appName=Cluster0';

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
