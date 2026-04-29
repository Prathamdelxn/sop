import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ProductionLine from "@/model/ProductionLine";

// PUT — update a production line
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await req.json();
    const { lineNumber, name } = body;

    const line = await ProductionLine.findById(id);
    if (!line) {
      return NextResponse.json({ success: false, message: "Line not found" }, { status: 404 });
    }

    // If lineNumber is changing, check for duplicates
    if (lineNumber && Number(lineNumber) !== line.lineNumber) {
      const existing = await ProductionLine.findOne({
        plantId: line.plantId,
        lineNumber: Number(lineNumber),
        _id: { $ne: id }
      });
      if (existing) {
        return NextResponse.json({
          success: false,
          message: `Line ${lineNumber} already exists for this plant.`
        }, { status: 409 });
      }
    }

    if (lineNumber !== undefined) line.lineNumber = Number(lineNumber);
    if (name !== undefined) line.name = name;

    await line.save();

    const populated = await ProductionLine.findById(id).populate("plantId", "name code");
    return NextResponse.json({ success: true, data: populated });
  } catch (error) {
    console.error("ProductionLine PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE — soft-delete a production line
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const line = await ProductionLine.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!line) {
      return NextResponse.json({ success: false, message: "Line not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: line });
  } catch (error) {
    console.error("ProductionLine DELETE error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
