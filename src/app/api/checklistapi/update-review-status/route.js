import dbConnect from "@/utils/db";
import Checklist from "@/model/ChecklistNew";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { prototypeId, reviewerId, status, comments } = body;

    if (!prototypeId || !reviewerId || !status) {
      return NextResponse.json(
        { error: "prototypeId, reviewerId and status are required" },
        { status: 400 }
      );
    }

    // ✅ Update specific review
    let updated = await Checklist.findOneAndUpdate(
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
        { error: "Prototype or Review not found" },
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
    console.error("❌ Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
