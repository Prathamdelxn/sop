import dbConnect from "@/utils/db";

import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

// ✅ Update Checklist Approval Status with Multi-Tenant Isolation
export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { prototypeId, approverId, status, comments, companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required for multi-tenant isolation" },
        { status: 400 }
      );
    }

    if (!prototypeId || !approverId || !status) {
      return NextResponse.json(
        { error: "prototypeId, approverId and status are required" },
        { status: 400 }
      );
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = ChecklistStatic; 
    const __tenantCompanyId = companyId;

    // ✅ Update specific review within the tenant-specific collection
    let updated = await ChecklistModel.findOneAndUpdate(
      { _id: prototypeId, "approvers.approverId": approverId },
      {
        $set: {
          "approvers.$.status": status,
          "approvers.$.comments": comments || "",
          "approvers.$.approvalDate": new Date().toISOString(),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Prototype or Approval record not found in this company's collection" },
        { status: 404 }
      );
    }

    // ✅ Determine overall status
    const hasRejected = updated.approvers.some((r) => r.status === "Rejected");
    const allApproved =
      updated.approvers.length > 0 &&
      updated.approvers.every((r) => r.status === "Approved");

    if (hasRejected) {
      updated.status = "Rejected";
    } else if (allApproved) {
      updated.status = "Approved";
    } else {
      updated.status = "Pending Approval"; // default while pending/mixed
    }

    updated.updatedAt = new Date();
    await updated.save();

    return NextResponse.json(
      { message: "Approval updated successfully", prototype: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating approval status:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
