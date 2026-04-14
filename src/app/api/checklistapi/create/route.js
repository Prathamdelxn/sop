import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { getTenantModel } from "@/utils/tenantDb";

// CREATE a checklist (no duplicate names allowed within the same company)
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    const { companyId, name } = data;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required for data isolation" }, { status: 400 });
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = getTenantModel("Checklist", companyId);

    // 🔍 check if checklist with same name already exists in this company's collection
    const existing = await ChecklistModel.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { error: "Checklist with this name already exists for your company" },
        { status: 400 }
      );
    }

    // ✅ create new checklist in the company collection
    const newChecklist = await ChecklistModel.create(data);

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
 