import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import Prototype from "@/model/Task";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid prototype ID" }, { status: 400 });
    }

    const prototype = await Prototype.findById(id);

    if (!prototype) {
      return NextResponse.json({ error: "Prototype not found" }, { status: 404 });
    }

    return NextResponse.json(prototype, { status: 200 });
  } catch (error) {
    console.error("Error fetching prototype:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
