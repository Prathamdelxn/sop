import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Checklist from "@/model/ChecklistNew"; // import your model
 
// CREATE a checklist (no duplicate names allowed)
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
 
    // 🔍 check if checklist with same name already exists
    const existing = await Checklist.findOne({ name: data.name });
    if (existing) {
      return NextResponse.json(
        { error: "Checklist with this name already exists" },
        { status: 400 }
      );
    }
    console.log("asdfasdf",data);
 
    // ✅ create new checklist
    const newChecklist = await Checklist.create(data);
 
    return NextResponse.json(newChecklist, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating checklist:", error);
 
    // handle duplicate key error (index on DB)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Checklist with this name already exists" },
        { status: 400 }
      );
    }
 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 