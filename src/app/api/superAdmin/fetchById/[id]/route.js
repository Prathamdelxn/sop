import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";

// Enable dynamic route handling
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params;

    const superAdmin = await SuperAdmin.findById(id);

    if (!superAdmin) {
      return NextResponse.json({ success: false, message: "SuperAdmin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, superAdmin });
  } catch (err) {
    console.error("Fetch SuperAdmin by ID error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
