import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBatch from "@/model/ElogbookBatch";

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await req.json();
    const { action, endUser } = body;

    if (action !== "end") {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    const batch = await ElogbookBatch.findById(id);
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 });
    }

    if (batch.status === "completed") {
      return NextResponse.json({ success: false, message: "Batch already completed" }, { status: 400 });
    }

    const endTime = new Date();
    const totalProductionTime = Math.floor((endTime - new Date(batch.startTime)) / 60000); // in minutes

    batch.endTime = endTime;
    batch.endUser = endUser || "";
    batch.status = "completed";
    batch.totalProductionTime = totalProductionTime;

    await batch.save();

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    console.error("ElogbookBatch PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
