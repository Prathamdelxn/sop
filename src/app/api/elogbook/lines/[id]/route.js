import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ProductionLine from "@/model/ProductionLine";

export const dynamic = "force-dynamic";

// PUT — update a production line (name, status, sublines)
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();

    const line = await ProductionLine.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).populate("plantId", "name code");

    if (!line) {
      return NextResponse.json({ success: false, message: "Line not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: line });
  } catch (error) {
    console.error("ProductionLine PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE — soft delete a production line
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const line = await ProductionLine.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!line) {
      return NextResponse.json({ success: false, message: "Line not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Line deleted successfully" });
  } catch (error) {
    console.error("ProductionLine DELETE error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
