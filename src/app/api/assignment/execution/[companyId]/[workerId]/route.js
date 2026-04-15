import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


export async function GET(req, { params }) {
  try {
    const { companyId, workerId } = await params;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

    // Query: check worker inside stage, task, or subtask
    const assignments = await AssignmentModel.find({
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
