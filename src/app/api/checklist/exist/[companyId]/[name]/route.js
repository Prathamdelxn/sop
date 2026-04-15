import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

export async function GET(request, { params }) {
  try {
    const { companyId, name } = await params;

    if (!companyId || !name) {
      return NextResponse.json({ exists: false, error: "Company ID and Name are required" }, { status: 400 });
    }

    await dbConnect();

    // Get the dynamic Prototype model for this company
    const PrototypeModel = PrototypeStatic; 
    const __tenantCompanyId = companyId;

    const decodedName = decodeURIComponent(name);
    const existing = await PrototypeModel.findOne({ name: decodedName, companyId: __tenantCompanyId });

    return NextResponse.json({ 
      success: true,
      exists: !!existing 
    });
  } catch (error) {
    console.error("Error checking checklist existence:", error);
    return NextResponse.json({ 
      success: false, 
      exists: false, 
      error: error.message 
    }, { status: 500 });
  }
}
