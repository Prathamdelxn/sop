import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Plant from "@/model/Plant";

export const dynamic = "force-dynamic";

// GET — fetch all plants for a company
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const plants = await Plant.find({ companyId, isActive: true }).sort({ name: 1 });
    return NextResponse.json({ success: true, data: plants });
  } catch (error) {
    console.error("Plant GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create a new plant
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { companyId, name, code, address, city, state, country } = body;

    if (!companyId || !name || !code) {
      return NextResponse.json({ success: false, message: "companyId, name, and code are required" }, { status: 400 });
    }

    // Check for duplicate code within company
    const existing = await Plant.findOne({ companyId, code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: `A plant with code "${code.toUpperCase()}" already exists for this company.`
      }, { status: 409 });
    }

    const plant = await Plant.create({
      companyId,
      name,
      code: code.toUpperCase(),
      address: address || "",
      city: city || "",
      state: state || "",
      country: country || "India",
    });

    return NextResponse.json({ success: true, data: plant }, { status: 201 });
  } catch (error) {
    console.error("Plant POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
