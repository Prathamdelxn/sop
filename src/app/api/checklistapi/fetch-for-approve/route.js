import dbConnect from "@/utils/db";
import { getTenantModel } from "@/utils/tenantDb";
import { NextResponse } from "next/server";

// ✅ Fetch Checklists for Approval with Multi-Tenant Isolation
export async function POST(req) {
  try {
    await dbConnect();

    // Extract data from request body
    const body = await req.json();
    const { companyId, approverId } = body;

    console.log("Fetching for approval - companyId:", companyId, "approverId:", approverId);

    if (!companyId || !approverId) {
      return NextResponse.json(
        { error: "companyId and approverId are required" },
        { status: 400 }
      );
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = getTenantModel("Checklist", companyId);

    // Query prototypes within the tenant-specific collection
    const prototypes = await ChecklistModel.find({
      companyId, // Still filter by companyId for safety, though collection is already isolated
      status: { $in: ["Pending Approval", "Approved", "Rejected"] },
      approvers: {
        $elemMatch: { 
          approverId,
          status: { $in: ["Pending Approval", "Approved", "Rejected"] }
        },
      }
    }).sort({ createdAt: -1 });

    return NextResponse.json(prototypes, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching prototypes for approval:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
