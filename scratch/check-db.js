import mongoose from "mongoose";
import connectDB from "./src/utils/db.js";
import Company from "./src/model/Company.js";
import SuperAdmin from "./src/model/SuperAdmin.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function checkStatus() {
  await connectDB();
  
  const companyCount = await Company.countDocuments();
  const companies = await Company.find().limit(5);
  
  console.log(`Total Companies: ${companyCount}`);
  companies.forEach(c => {
    console.log(`Company ID: ${c.companyId}, Status: ${c.status}`);
  });

  const adminCount = await SuperAdmin.countDocuments();
  const admins = await SuperAdmin.find().limit(5);

  console.log(`Total SuperAdmins: ${adminCount}`);
  admins.forEach(a => {
    console.log(`Admin ID: ${a._id}, Status: ${a.status}`);
  });

  process.exit(0);
}

checkStatus().catch(err => {
  console.error(err);
  process.exit(1);
});
