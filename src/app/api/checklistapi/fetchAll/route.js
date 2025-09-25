// src/app/api/checklist/fetch-all/route.js
import dbConnect from "@/utils/db"; // your mongoose connection helper
import Checklist from "@/model/ChecklistNew"; // your checklist model
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all checklists
    const checklists = await Checklist.find({});

    return NextResponse.json({
      success: true,
      count: checklists.length,
      data: checklists,
    });
  } catch (error) {
    console.error("❌ Fetch All Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch checklists" },
      { status: 500 }
    );
  }
}
