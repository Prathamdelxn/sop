// app/api/superadmin/fetchAll/route.js

import { NextResponse } from "next/server";
import SuperAdmin from "@/model/SuperAdmin";
import connectDB from "@/utils/db";

// Enable dynamic behavior
export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();

  try {
    const superadmins = await SuperAdmin.find().sort({ createdAt: -1 }); // newest first
    return NextResponse.json({ success: true, superadmins }, { status: 200 });
  } catch (error) {
    console.error("Error fetching SuperAdmins:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch SuperAdmins" }, { status: 500 });
  }
}
