import dbConnect from "@/utils/db";

import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id: assignmentId } = await params; // assignmentId from URL
    const body = await req.json();

    const { stages, status, companyId } = body;

    if (!assignmentId || !stages || !companyId) {
      return NextResponse.json(
        { error: "assignmentId, stages, and companyId are required" },
        { status: 400 }
      );
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

    // ✅ Update only stages and status inside prototypeData
    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      assignmentId,
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
