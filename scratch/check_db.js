import mongoose from 'mongoose';
import connectDB from '../src/utils/db.js';
import ElogbookMasterData from '../src/model/ElogbookMasterData.js';

async function test() {
  await connectDB();
  const records = await ElogbookMasterData.find({});
  console.log('Total records:', records.length);
  if (records.length > 0) {
    console.log('Sample record ID:', records[0]._id);
  }
  process.exit(0);
}

test();
