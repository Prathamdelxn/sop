import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ProductionLine from "@/model/ProductionLine";

export const dynamic = "force-dynamic";

// GET — fetch all lines for a plant (or all lines for a company)
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const plantId = searchParams.get("plantId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const filter = { companyId, isActive: true };
    if (plantId) filter.plantId = plantId;

    const lines = await ProductionLine.find(filter)
      .populate("plantId", "name code")
      .sort({ lineNumber: 1 });

    return NextResponse.json({ success: true, data: lines });
  } catch (error) {
    console.error("ProductionLine GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create a new production line
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { companyId, plantId, lineNumber, name } = body;

    if (!companyId || !plantId || !lineNumber) {
      return NextResponse.json({ success: false, message: "companyId, plantId, and lineNumber are required" }, { status: 400 });
    }

    // Check for duplicate line number in this plant
    const existing = await ProductionLine.findOne({ plantId, lineNumber: Number(lineNumber) });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: `Line ${lineNumber} already exists for this plant.`
      }, { status: 409 });
    }

    const line = await ProductionLine.create({
      companyId,
      plantId,
      lineNumber: Number(lineNumber),
      name: name || `Line ${lineNumber}`,
    });

    const populated = await ProductionLine.findById(line._id).populate("plantId", "name code");
    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("ProductionLine POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
