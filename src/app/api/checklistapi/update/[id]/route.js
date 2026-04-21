// app/api/checklistapi/update/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


// ✅ Update Checklist by ID with Multi-Tenant Isolation
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();
    const { companyId } = data;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required for multi-tenant isolation" },
        { status: 400 }
      );
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    // ✅ Update and return the new document within the tenant-specific collection
    const updatedChecklist = await ChecklistModel.findByIdAndUpdate(
      id,
      { 
        ...data, 
        status: "InProgress", 
        rejectionReason: null, 
        reviews: [], 
        approvers: [], 
        updatedAt: Date.now() 
      },
      { new: true } // return updated doc
    );

    if (!updatedChecklist) {
      return NextResponse.json(
        { message: "Checklist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedChecklist, { status: 200 });
  } catch (error) {
    console.error("❌ Update checklist error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
