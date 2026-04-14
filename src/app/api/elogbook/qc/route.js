import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookQC from "@/model/ElogbookQC";
import ElogbookBasket from "@/model/ElogbookBasket";

export const dynamic = "force-dynamic";

// GET — fetch QC records
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const basketId = searchParams.get("basketId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const filter = { companyId };
    if (basketId) filter.basketId = basketId;

    const records = await ElogbookQC.find(filter)
      .populate({
        path: "basketId",
        populate: { path: "masterDataId" }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("ElogbookQC GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create QC inspection record
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const {
      basketId, companyId, inspectorName,
      inspectedQuantity, goodQuantity, defects,
    } = body;

    if (!basketId || !companyId || !inspectorName || !inspectedQuantity) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Calculate total defects and rework quantity
    const totalDefects = Object.values(defects || {}).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const reworkQty = inspectedQuantity - (goodQuantity || 0);

    const qcRecord = await ElogbookQC.create({
      basketId,
      companyId,
      inspectorName,
      inspectedQuantity,
      goodQuantity: goodQuantity || 0,
      reworkQuantity: reworkQty > 0 ? reworkQty : 0,
      defects: {
        watermark1: defects?.watermark1 || 0,
        watermark2: defects?.watermark2 || 0,
        maskingProblem: defects?.maskingProblem || 0,
        scratchMark: defects?.scratchMark || 0,
        pvcPeelOff: defects?.pvcPeelOff || 0,
      },
      reworkStatus: reworkQty > 0 ? "pending" : "none",
      finalGoodQuantity: goodQuantity || 0,
    });

    // Update basket status
    await ElogbookBasket.findByIdAndUpdate(basketId, { status: "qc-done" });

    return NextResponse.json({ success: true, data: qcRecord }, { status: 201 });
  } catch (error) {
    console.error("ElogbookQC POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
