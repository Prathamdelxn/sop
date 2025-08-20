import dbConnect from "@/utils/db";
import Prototype from "@/model/Task";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    // Extract data from request body
    const body = await req.json();
    const { companyId, reviewerId } = body;
console.log("ad",companyId);
console.log("adddd",reviewerId);
    if (!companyId || !reviewerId) {
      return NextResponse.json(
        { error: "companyId and reviewerId are required" },
        { status: 400 }
      );
    }

    // Query prototypes
    const prototypes = await Prototype.find({
      companyId,
      status: "Under Review",
      reviews: {
        $elemMatch: { reviewerId }
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
