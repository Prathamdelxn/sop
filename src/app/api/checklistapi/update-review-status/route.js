import dbConnect from "@/utils/db";
import { getTenantModel } from "@/utils/tenantDb";
import { NextResponse } from "next/server";

// ✅ Update Checklist Review Status with Multi-Tenant Isolation
export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { prototypeId, reviewerId, status, comments, companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required for multi-tenant isolation" },
        { status: 400 }
      );
    }

    if (!prototypeId || !reviewerId || !status) {
      return NextResponse.json(
        { error: "prototypeId, reviewerId and status are required" },
        { status: 400 }
      );
    }

    // Get the dynamic Checklist model for this company
    const ChecklistModel = getTenantModel("Checklist", companyId);

    // ✅ Update specific review within the tenant-specific collection
    let updated = await ChecklistModel.findOneAndUpdate(
      { _id: prototypeId, "reviews.reviewerId": reviewerId },
      {
        $set: {
          "reviews.$.status": status,
          "reviews.$.comments": comments || "",
          "reviews.$.reviewDate": new Date().toISOString(),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Prototype or Review record not found in this company's collection" },
        { status: 404 }
      );
    }

    // ✅ Determine overall status
    const hasRejected = updated.reviews.some((r) => r.status === "Rejected");
    const allApproved =
      updated.reviews.length > 0 &&
      updated.reviews.every((r) => r.status === "Approved");

    if (hasRejected) {
      updated.status = "Rejected Review";
    } else if (allApproved) {
      updated.status = "Approved Review";
    } else {
      updated.status = "Under Review"; // default while pending/mixed
    }

    updated.updatedAt = new Date();
    await updated.save();

    return NextResponse.json(
      { message: "Review updated successfully", prototype: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating review status:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
