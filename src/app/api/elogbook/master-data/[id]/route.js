import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookMasterData from "@/model/ElogbookMasterData";

export const dynamic = "force-dynamic";

// PUT — update master data record
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await ElogbookMasterData.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("ElogbookMasterData PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE — remove master data record
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const deleted = await ElogbookMasterData.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("ElogbookMasterData DELETE error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
