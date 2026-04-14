import mongoose from "mongoose";
import dns from "dns";

// dns.setDefaultResultOrder("ipv4first"); 

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI missing");
}

// ✅ FIX: safer global cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("👉 dbConnect called");

  // ❌ IMPORTANT FIX: verify connection is actually alive
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("⚡ Using ACTIVE cached connection");
    return cached.conn;
  }

  console.log("⏳ Creating new connection...");

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "sop",
    }).then((mongoose) => {
      console.log("✅ MongoDB connected:", mongoose.connection.host);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("❌ Connection failed:", error);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;