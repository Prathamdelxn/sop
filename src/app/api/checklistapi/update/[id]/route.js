// app/api/checklists/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Checklist from "@/model/ChecklistNew"; // your schema file

// ✅ Update Checklist by ID
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    // ✅ Update and return the new document
    const updatedChecklist = await Checklist.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true } // return updated doc
    );

    if (!updatedChecklist) {
      return NextResponse.json(
        { message: "Checklist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedChecklist, { status: 200 });
  } catch (error) {
    console.error("❌ Update checklist error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
