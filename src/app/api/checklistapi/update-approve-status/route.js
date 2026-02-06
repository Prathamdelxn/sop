import dbConnect from "@/utils/db";
import Checklist from "@/model/ChecklistNew";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { prototypeId, approverId, status, comments } = body;

    if (!prototypeId || !approverId || !status) {
      return NextResponse.json(
        { error: "prototypeId, reviewerId and status are required" },
        { status: 400 }
      );
    }

    // ✅ Update specific review
    let updated = await Checklist.findOneAndUpdate(
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
        { error: "Prototype or Approval not found" },
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
    console.error("❌ Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
