
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://krishna:apnkan911@sop.5wl3r2j.mongodb.net/";

async function checkIndices() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'sop' });
    console.log('Connected to DB.');

    const collection = mongoose.connection.db.collection('users');
    const indices = await collection.indexes();
    
    console.log('--- Current Indices on "users" ---');
    console.log(JSON.stringify(indices, null, 2));
    console.log('---------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

checkIndices();
