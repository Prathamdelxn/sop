import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import { getTenantModel } from "@/utils/tenantDb";

export async function GET(request, { params }) {
  try {
    const { companyId, name } = await params;

    if (!companyId || !name) {
      return NextResponse.json({ exists: false, error: "Company ID and Name are required" }, { status: 400 });
    }

    await dbConnect();

    // Get the dynamic Prototype model for this company
    const PrototypeModel = getTenantModel("Prototype", companyId);

    const decodedName = decodeURIComponent(name);
    const existing = await PrototypeModel.findOne({ name: decodedName });

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
