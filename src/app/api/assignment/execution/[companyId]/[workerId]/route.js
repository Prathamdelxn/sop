import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Assignment from "@/model/NewAssignment"; // your Mongoose schema


export async function GET(req, { params }) {
  try {
    const { companyId, workerId } = params;

    // Query: check worker inside stage, task, or subtask
    const assignments = await Assignment.find({
      companyId,
      $or: [
        { "prototypeData.stages.assignedWorker.id": workerId },
        { "prototypeData.stages.tasks.assignedWorker.id": workerId },
        { "prototypeData.stages.tasks.subtasks.assignedWorker.id": workerId },
      ],
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
