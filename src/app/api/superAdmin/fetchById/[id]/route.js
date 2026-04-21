import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import mongoose from "mongoose";

// Enable dynamic route handling
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;

    let superAdmin;
    
    // Check if 'id' is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      superAdmin = await SuperAdmin.findById(id);
    } 
    
    // If not found by _id, or if 'id' was a string like 'comp_123', search by companyId field
    if (!superAdmin) {
      superAdmin = await SuperAdmin.findOne({ companyId: id });
    }

    if (!superAdmin) {
      return NextResponse.json({ success: false, message: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, superAdmin });
  } catch (err) {
    console.error("Fetch SuperAdmin by ID error:", err);
    return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
  }
}
