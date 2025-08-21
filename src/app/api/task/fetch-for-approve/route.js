import dbConnect from "@/utils/db";
import Prototype from "@/model/Task";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    // Extract data from request body
    const body = await req.json();
    const { companyId, approverId } = body;
console.log("ad",companyId);
console.log("adddd",approverId);
    if (!companyId || !approverId) {
      return NextResponse.json(
        { error: "companyId and approverId are required" },
        { status: 400 }
      );
    }

    // Query prototypes
    const prototypes = await Prototype.find({
      companyId,
      status: "Pending Approval",
      approvers: {
        $elemMatch: { approverId }
      }
    }).sort({ createdAt: -1 });

    return NextResponse.json(prototypes, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching prototypes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
