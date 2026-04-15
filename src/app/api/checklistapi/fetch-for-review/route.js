import dbConnect from "@/utils/db";

import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

// ✅ Fetch Checklists for Review with Multi-Tenant Isolation
export async function POST(req) {
  try {
    await dbConnect();

    // Extract data from request body
    const body = await req.json();
    const { companyId, reviewerId } = body;
    
    console.log("Fetching for review - companyId:", companyId, "reviewerId:", reviewerId);

    if (!companyId || !reviewerId) {
      return NextResponse.json(
        { error: "companyId and reviewerId are required" },
        { status: 400 }
      );
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    // Query prototypes within the tenant-specific collection
    const prototypes = await ChecklistModel.find({
      companyId, // Filter by companyId for consistency
      status: { 
        $in: [
          "Under Review", 
          "Approved", 
          "Rejected Review", 
          "Approved Review", 
          "Rejected", 
          "Pending Approval"
        ] 
      },
      reviews: {
        $elemMatch: { 
          reviewerId,
          status: { $in: ["Pending Review", "Approved", "Rejected"] }
        }
      }
    }).sort({ createdAt: -1 });

    return NextResponse.json(prototypes, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching prototypes for review:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}