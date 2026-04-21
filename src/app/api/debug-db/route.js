import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  try {
    const conn = await mongoose.createConnection(MONGODB_URI, { dbName: "sop" }).asPromise();
    const admin = conn.db.admin();
    const dbs = await admin.listDatabases();
    
    // Also list collections in the current database
    const collections = await conn.db.listCollections().toArray();

    // Get a sample regular user
    const sampleUser = await conn.db.collection("users").findOne({});
    
    await conn.close();
    
    return NextResponse.json({
      databases: dbs.databases.map(d => d.name),
      currentDb: conn.db.databaseName,
      collections: collections.map(c => c.name),
      sampleUser: sampleUser
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
