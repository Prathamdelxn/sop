
const mongoose = require('mongoose');
const dns = require('dns');

// Note: Hardcoded for this specific migration run
const MONGODB_URI = "mongodb+srv://krishna:apnkan911@sop.5wl3r2j.mongodb.net/";

// Robust DNS configuration (from src/utils/db.js)
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("⚠️ Failed to set DNS servers:", e.message);
}

const UserSchema = new mongoose.Schema({
  username: String,
  companyId: String,
}, { strict: false });

const SuperAdminSchema = new mongoose.Schema({
  companyId: String,
}, { strict: false });

async function migrate() {
  try {
    console.log('Connecting to DB (with robust DNS settings)...');
    
    // We try to connect using the srv string. Node should use the dns servers we set above.
    await mongoose.connect(MONGODB_URI, {
      dbName: 'sop',
      connectTimeoutMS: 10000,
    });
    console.log('Connected.');

    const User = mongoose.model('User', UserSchema);
    const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

    // 1. Find all users
    const users = await User.find({});
    console.log(`Checking ${users.length} users...`);

    let updatedCount = 0;

    for (const user of users) {
      const currentId = user.companyId;

      // If currentId is a 24-char hex string, it might be an ObjectId
      if (currentId && currentId.length === 24 && /^[0-9a-fA-F]+$/.test(currentId)) {
        // Try to find if this matches any SuperAdmin's internal _id
        const admin = await SuperAdmin.findById(currentId);
        if (admin && admin.companyId) {
          console.log(`Updating worker ${user.username}: ${currentId} -> ${admin.companyId}`);
          await User.updateOne({ _id: user._id }, { $set: { companyId: admin.companyId } });
          updatedCount++;
        }
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    
    if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
       console.log('\n--- HINT ---');
       console.log('This error persists because the local Node environment is struggling with SRV records.');
       console.log('Since the app use a "Manual Resolution" fallback in src/utils/db.js,');
       console.log('you might need to run this migration via a temporary API route if standalone execution fails.');
       console.log('------------\n');
    }
    
    process.exit(1);
  }
}

migrate();
