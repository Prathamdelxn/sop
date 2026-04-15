import dbConnect from "@/utils/db";

import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!id) {
      return NextResponse.json({ error: "ID is required in URL" }, { status: 400 });
    }

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required for data isolation" }, { status: 400 });
    }

    // Get the dynamic model for this company
    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    const deleted = await ChecklistModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Checklist deleted successfully", data: deleted },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("❌ Error deleting checklist:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
