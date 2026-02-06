import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Checklist from "@/model/ChecklistNew"; // adjust path

// GET checklist by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: "Invalid checklist ID" },
        { status: 400 }
      );
    }

    const checklist = await Checklist.findById(id);

    if (!checklist) {
      return NextResponse.json(
        { error: "Checklist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(checklist, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching checklist by id:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
