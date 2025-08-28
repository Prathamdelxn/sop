import dbConnect from "@/utils/db";
import Assignment from "@/model/NewAssignment";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params; // assignmentId from URL
    const body = await req.json();

    const { stages, status } = body;

    if (!id || !stages) {
      return NextResponse.json(
        { error: "assignmentId and stages are required" },
        { status: 400 }
      );
    }

    // ✅ Update only stages and status inside prototypeData
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      {
        $set: {
          "prototypeData.stages": stages,
          status: status || "InProgress",
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAssignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Failed to update assignment", details: error.message },
      { status: 500 }
    );
  }
}
