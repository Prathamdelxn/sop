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

// POST — create or update QC inspection record (incremental)
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

    // 1. Find the current basket to get its batch and number for interlock
    const currentBasket = await ElogbookBasket.findById(basketId);
    if (!currentBasket) {
      return NextResponse.json({ success: false, message: "Basket not found" }, { status: 404 });
    }

    // 2. Interlock Check (only if it's the first time starting QC for this basket)
    let qcRecord = await ElogbookQC.findOne({ basketId });
    if (!qcRecord && currentBasket.basketNumber > 1) {
      const prevBasket = await ElogbookBasket.findOne({
        batchId: currentBasket.batchId,
        basketNumber: currentBasket.basketNumber - 1
      });

      if (prevBasket) {
        if (prevBasket.status !== "qc-done") {
          return NextResponse.json({
            success: false,
            message: `Interlock: Please complete QC for Basket ${prevBasket.basketNumber} first.`
          }, { status: 400 });
        }

        // Also check if rework is completed for the previous basket
        const prevQC = await ElogbookQC.findOne({ basketId: prevBasket._id });
        if (prevQC && prevQC.reworkStatus === "pending") {
          return NextResponse.json({
            success: false,
            message: `Interlock: Rework is pending for Basket ${prevBasket.basketNumber}. Please complete it first.`
          }, { status: 400 });
        }
      }
    }

    // 3. Incremental Logic
    const incomingGood = Number(goodQuantity) || 0;
    const incomingDefects = defects || {};
    const incomingDefectTotal = Object.values(incomingDefects).reduce((sum, v) => sum + (Number(v) || 0), 0);

    if (qcRecord) {
      // Update existing record
      qcRecord.goodQuantity += incomingGood;
      qcRecord.defects.watermark1 += Number(incomingDefects.watermark1) || 0;
      qcRecord.defects.watermark2 += Number(incomingDefects.watermark2) || 0;
      qcRecord.defects.maskingProblem += Number(incomingDefects.maskingProblem) || 0;
      qcRecord.defects.scratchMark += Number(incomingDefects.scratchMark) || 0;
      qcRecord.defects.pvcPeelOff += Number(incomingDefects.pvcPeelOff) || 0;

      // Re-calculate total defects/rework
      const currentDefects = qcRecord.defects;
      const totalDefects = (currentDefects.watermark1 || 0) +
        (currentDefects.watermark2 || 0) +
        (currentDefects.maskingProblem || 0) +
        (currentDefects.scratchMark || 0) +
        (currentDefects.pvcPeelOff || 0);

      qcRecord.reworkQuantity = totalDefects;
      // Final good = current good + any previously passed from rework
      qcRecord.finalGoodQuantity = qcRecord.goodQuantity + (qcRecord.reworkPassedQuantity || 0);

      if (qcRecord.reworkQuantity > 0 && qcRecord.reworkStatus === "none") {
        qcRecord.reworkStatus = "pending";
      }

      await qcRecord.save();
    } else {
      // Create new record
      qcRecord = await ElogbookQC.create({
        basketId,
        companyId,
        inspectorName,
        inspectedQuantity,
        goodQuantity: incomingGood,
        reworkQuantity: incomingDefectTotal,
        defects: {
          watermark1: Number(incomingDefects.watermark1) || 0,
          watermark2: Number(incomingDefects.watermark2) || 0,
          maskingProblem: Number(incomingDefects.maskingProblem) || 0,
          scratchMark: Number(incomingDefects.scratchMark) || 0,
          pvcPeelOff: Number(incomingDefects.pvcPeelOff) || 0,
        },
        reworkStatus: incomingDefectTotal > 0 ? "pending" : "none",
        finalGoodQuantity: incomingGood,
      });
    }

    // 4. Update basket status if fully checked
    const totalChecked = qcRecord.goodQuantity + qcRecord.reworkQuantity;
    if (totalChecked >= inspectedQuantity) {
      if (currentBasket.status === "pending-qc") {
        await ElogbookBasket.findByIdAndUpdate(basketId, { status: "qc-done" });
      }
    }

    return NextResponse.json({ success: true, data: qcRecord });
  } catch (error) {
    console.error("ElogbookQC POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
