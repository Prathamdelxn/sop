import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { getTenantModel } from "@/utils/tenantDb";

// PATCH /api/checklistapi/update-status/[id]
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const { status, rejectionReason, reviews, approvers, companyId } = body;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required for data isolation" }, { status: 400 });
    }

    // Get the dynamic model for this company
    const ChecklistModel = getTenantModel("Checklist", companyId);

    const updateData = {
      status,
      updatedAt: new Date(),
    };

    // If rejected, add reason
    if (status === "Rejected") {
      if (!rejectionReason || rejectionReason.trim() === "") {
        return NextResponse.json(
          { error: "Rejection reason is required for rejected status" },
          { status: 400 }
        );
      }
      updateData.rejectionReason = rejectionReason;
    } else {
      updateData.rejectionReason = null;
    }

    // If reviews are provided, update them
    if (reviews && Array.isArray(reviews)) {
      updateData.reviews = reviews.map(review => ({
        reviewerId: review.reviewerId,
        reviewerName: review.reviewerName,
        reviewerRole: review.reviewerRole,
        status: review.status || 'pending',
        comments: review.comments || '',
        reviewDate: review.reviewDate || new Date()
      }));
    }

    if (approvers && Array.isArray(approvers)) {
      updateData.approvers = approvers.map(approver => ({
        approverId: approver.approverId,
        approverName: approver.approverName,
        approverRole: approver.approverRole,
        status: approver.status || 'Pending Approval',
        comments: approver.comments || '',
        approvalDate: approver.approvalDate || new Date()
      }));
    }

    const updatedChecklist = await ChecklistModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedChecklist) {
      return NextResponse.json(
        { error: "Checklist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Status updated successfully",
      checklist: updatedChecklist
    });
  } catch (error) {
    console.error("Error updating checklist status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}