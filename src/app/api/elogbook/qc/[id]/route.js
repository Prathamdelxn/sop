import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookQC from "@/model/ElogbookQC";

export const dynamic = "force-dynamic";

// PUT — update rework result
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();
    const { reworkPassedQuantity, permanentRejections } = body;

    const qcRecord = await ElogbookQC.findById(id);
    if (!qcRecord) {
      return NextResponse.json({ success: false, message: "QC record not found" }, { status: 404 });
    }

    qcRecord.reworkPassedQuantity = reworkPassedQuantity || 0;
    qcRecord.permanentRejections = permanentRejections || 0;
    qcRecord.reworkStatus = "completed";

    // Final good = initial good + rework passed
    qcRecord.finalGoodQuantity = qcRecord.goodQuantity + qcRecord.reworkPassedQuantity;

    await qcRecord.save();

    return NextResponse.json({ success: true, data: qcRecord });
  } catch (error) {
    console.error("ElogbookQC PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
