
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import Checklist from "@/model/ChecklistNew";

// PATCH /api/prototype/update-status/[id]
export async function PATCH(request, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const body = await request.json();
    const { status, rejectionReason, reviews,approvers } = body;

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
      // Clear rejection reason if approved or any other status
      updateData.rejectionReason = null;
    }

    // If reviews are provided in the request, update them
    if (reviews && Array.isArray(reviews)) {
      updateData.reviews = reviews.map(review => ({
        reviewerId: review.reviewerId,
        reviewerName: review.reviewerName,
        reviewerRole:review.reviewerRole,
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
console.log(updateData);
    const updatedPrototype = await Checklist.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPrototype) {
      return NextResponse.json(
        { error: "checklist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Status updated successfully",
      checklist: updatedPrototype
    });
  } catch (error) {
    console.error("Error updating prototype status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}