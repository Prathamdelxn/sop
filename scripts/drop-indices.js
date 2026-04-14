
const mongoose = require('mongoose');
const dns = require('dns');

const MONGODB_URI = "mongodb+srv://krishna:apnkan911@sop.5wl3r2j.mongodb.net/";

// Robust DNS configuration
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

async function dropIndices() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'sop' });
    console.log('Connected.');

    const collection = mongoose.connection.db.collection('users');
    console.log('Dropping indices on "users"...');
    
    // We try to drop the global email index specifically if it exists
    // Or just drop all (except _id) to be safe and let Mongoose recreate
    try {
      await collection.dropIndex('email_1');
      console.log('Successfully dropped legacy global email index.');
    } catch (e) {
      console.log('Legacy email index not found or already dropped.');
    }

    try {
      await collection.dropIndex('username_1');
      console.log('Dropped legacy username index.');
    } catch (e) {}
    
    console.log('Cleanup complete.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

dropIndices();
