import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


// CREATE a checklist (no duplicate names allowed within the same company)
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    const { companyId, name } = data;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required for data isolation" }, { status: 400 });
    }

    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    // 🔍 check if checklist with same name already exists in this company's collection
    const existing = await ChecklistModel.findOne({ name, companyId: __tenantCompanyId });
    if (existing) {
      return NextResponse.json(
        { error: "Checklist with this name already exists for your company" },
        { status: 400 }
      );
    }

    // ✅ create new checklist in the company collection
    const newChecklist = await ChecklistModel.create({ ...data, companyId: __tenantCompanyId });

    if (newChecklist && newChecklist._id) {
       await CompanyStatic.findOneAndUpdate(
           { companyId },
           { $push: { checklists: newChecklist._id } }
       );
    }

    return NextResponse.json(newChecklist, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating checklist:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Checklist with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}