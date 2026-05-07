import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookQC from "@/model/ElogbookQC";
import ElogbookBasket from "@/model/ElogbookBasket";
import ElogbookBatch from "@/model/ElogbookBatch";

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
        populate: [
          { path: "masterDataId" },
          { path: "items.masterDataId" },
          { path: "batchId", select: "batchNumber plantId lineId" },
          { path: "plantId", select: "name code" },
          { path: "lineId", select: "lineNumber name" },
        ]
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
      basketId, companyId, inspectorName, masterDataId,
      inspectedQuantity, goodQuantity, defects,
    } = body;

    if (!basketId || !companyId || !inspectorName || !inspectedQuantity) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. Find the current basket
    const currentBasket = await ElogbookBasket.findById(basketId);
    if (!currentBasket) {
      return NextResponse.json({ success: false, message: "Basket not found" }, { status: 404 });
    }

    // Target part for this inspection call
    const targetPartId = masterDataId || currentBasket.masterDataId;

    // Get batch info
    let batchNumber = "";
    let plantId = currentBasket.plantId || null;
    let lineId = currentBasket.lineId || null;
    if (currentBasket.batchId) {
      const batch = await ElogbookBatch.findById(currentBasket.batchId);
      if (batch) {
        batchNumber = batch.batchNumber || "";
        plantId = batch.plantId || plantId;
        lineId = batch.lineId || lineId;
      }
    }

    // 2. Interlock Check
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

    if (!qcRecord) {
      // Create new record, initialize items from basket
      const initialItems = (currentBasket.items && currentBasket.items.length > 0) 
        ? currentBasket.items.map(item => ({
            masterDataId: item.masterDataId,
            inspectedQuantity: item.quantity,
            goodQuantity: 0,
            reworkQuantity: 0,
            defects: { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 },
            reworkStatus: "none",
            reworkPassedQuantity: 0,
            permanentRejections: 0,
            finalGoodQuantity: 0
          }))
        : [{
            masterDataId: currentBasket.masterDataId,
            inspectedQuantity: inspectedQuantity, // Fallback to passed total
            goodQuantity: 0,
            reworkQuantity: 0,
            defects: { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 },
            reworkStatus: "none",
            reworkPassedQuantity: 0,
            permanentRejections: 0,
            finalGoodQuantity: 0
          }];

      qcRecord = await ElogbookQC.create({
        basketId, companyId, plantId, lineId, batchNumber, inspectorName,
        inspectedQuantity, // Total for basket
        goodQuantity: 0,
        reworkQuantity: 0,
        items: initialItems,
        reworkStatus: "none",
        finalGoodQuantity: 0,
      });
    }

    // Update specific item
    let itemIndex = qcRecord.items.findIndex(it => it.masterDataId.toString() === targetPartId.toString());
    if (itemIndex === -1) {
      // If part not in items, add it
      qcRecord.items.push({
        masterDataId: targetPartId,
        inspectedQuantity: 0,
        goodQuantity: 0,
        reworkQuantity: 0,
        defects: { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 },
        reworkStatus: "none",
        reworkPassedQuantity: 0,
        permanentRejections: 0,
        finalGoodQuantity: 0
      });
      itemIndex = qcRecord.items.length - 1;
    }

    const item = qcRecord.items[itemIndex];
    item.goodQuantity += incomingGood;
    item.defects.watermark1 += Number(incomingDefects.watermark1) || 0;
    item.defects.watermark2 += Number(incomingDefects.watermark2) || 0;
    item.defects.maskingProblem += Number(incomingDefects.maskingProblem) || 0;
    item.defects.scratchMark += Number(incomingDefects.scratchMark) || 0;
    item.defects.pvcPeelOff += Number(incomingDefects.pvcPeelOff) || 0;

    const itemDefectTotal = (item.defects.watermark1 || 0) +
      (item.defects.watermark2 || 0) +
      (item.defects.maskingProblem || 0) +
      (item.defects.scratchMark || 0) +
      (item.defects.pvcPeelOff || 0);

    item.reworkQuantity = itemDefectTotal;
    item.finalGoodQuantity = item.goodQuantity + (item.reworkPassedQuantity || 0);

    if (item.reworkQuantity > 0 && item.reworkStatus === "none") {
      item.reworkStatus = "pending";
    }

    // Sync top-level totals for the basket
    qcRecord.goodQuantity = qcRecord.items.reduce((sum, it) => sum + it.goodQuantity, 0);
    qcRecord.reworkQuantity = qcRecord.items.reduce((sum, it) => sum + it.reworkQuantity, 0);
    qcRecord.finalGoodQuantity = qcRecord.items.reduce((sum, it) => sum + it.finalGoodQuantity, 0);
    
    // Sync top-level legacy defects
    qcRecord.defects.watermark1 = qcRecord.items.reduce((sum, it) => sum + it.defects.watermark1, 0);
    qcRecord.defects.watermark2 = qcRecord.items.reduce((sum, it) => sum + it.defects.watermark2, 0);
    qcRecord.defects.maskingProblem = qcRecord.items.reduce((sum, it) => sum + it.defects.maskingProblem, 0);
    qcRecord.defects.scratchMark = qcRecord.items.reduce((sum, it) => sum + it.defects.scratchMark, 0);
    qcRecord.defects.pvcPeelOff = qcRecord.items.reduce((sum, it) => sum + it.defects.pvcPeelOff, 0);

    if (qcRecord.reworkQuantity > 0 && qcRecord.reworkStatus === "none") {
      qcRecord.reworkStatus = "pending";
    } else if (qcRecord.reworkQuantity === 0) {
      qcRecord.reworkStatus = "none";
    }

    await qcRecord.save();

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
