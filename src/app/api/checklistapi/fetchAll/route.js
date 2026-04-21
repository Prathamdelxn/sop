import dbConnect from "@/utils/db";

import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "Company ID is required" }, { status: 400 });
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    // Fetch all checklists from the company-specific collection
    const checklists = await ChecklistModel.find({ companyId: __tenantCompanyId }).sort({ createdAt: -1 });

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
