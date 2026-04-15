import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


// GET checklist by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    // validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: "Invalid checklist ID" },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required for data isolation" }, { status: 400 });
    }

    // Get the dynamic model for this company
    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    const checklist = await ChecklistModel.findById(id);

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
