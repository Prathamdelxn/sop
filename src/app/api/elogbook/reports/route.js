import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBasket from "@/model/ElogbookBasket";
import ElogbookQC from "@/model/ElogbookQC";
import ElogbookMasterData from "@/model/ElogbookMasterData";

export const dynamic = "force-dynamic";

// GET — aggregated report data for charts
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const masterDataId = searchParams.get("masterDataId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    // Build basket filter
    const basketFilter = { companyId };
    if (masterDataId) basketFilter.masterDataId = masterDataId;

    if (startDate || endDate) {
      basketFilter.date = {};
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        basketFilter.date.$gte = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        basketFilter.date.$lte = e;
      }
    }

    // Fetch baskets
    const baskets = await ElogbookBasket.find(basketFilter)
      .populate("masterDataId")
      .sort({ basketNumber: 1 });

    // Fetch QC records for these baskets
    const basketIds = baskets.map(b => b._id);
    const qcRecords = await ElogbookQC.find({ basketId: { $in: basketIds } });

    // Map QC by basketId
    const qcMap = {};
    qcRecords.forEach(qc => {
      qcMap[qc.basketId.toString()] = qc;
    });

    // Build chart data
    const cycleTimeData = [];
    const quantityData = [];
    let totalDefects = { watermark1: 0, watermark2: 0, maskingProblem: 0, scratchMark: 0, pvcPeelOff: 0 };

    let totalBaskets = 0;
    let totalCycleTime = 0;
    let totalLostTime = 0;
    let totalGood = 0;
    let totalInspected = 0;

    baskets.forEach(basket => {
      const standard = basket.masterDataId?.standardCycleTime || 0;
      const label = `Basket ${basket.basketNumber}`;

      cycleTimeData.push({
        name: label,
        actual: basket.actualCycleTime || 0,
        standard,
        lost: basket.totalLostTime || 0,
        exceeds: (basket.actualCycleTime || 0) > standard,
      });

      const qc = qcMap[basket._id.toString()];
      if (qc) {
        quantityData.push({
          name: label,
          good: qc.finalGoodQuantity || qc.goodQuantity || 0,
          defective: qc.reworkQuantity || 0,
          rejected: qc.permanentRejections || 0,
          inspected: qc.inspectedQuantity || 0,
        });

        // Aggregate defects
        if (qc.defects) {
          Object.keys(totalDefects).forEach(key => {
            totalDefects[key] += qc.defects[key] || 0;
          });
        }

        totalGood += qc.finalGoodQuantity || qc.goodQuantity || 0;
        totalInspected += qc.inspectedQuantity || 0;
      }

      totalBaskets++;
      totalCycleTime += basket.actualCycleTime || 0;
      totalLostTime += basket.totalLostTime || 0;
    });

    const defectTrendData = Object.entries(totalDefects).map(([key, value]) => ({
      name: key === "watermark1" ? "Watermark 1"
        : key === "watermark2" ? "Watermark 2"
        : key === "maskingProblem" ? "Masking Problem"
        : key === "scratchMark" ? "Scratch Mark"
        : "PVC Peel Off",
      count: value,
    }));

    return NextResponse.json({
      success: true,
      data: {
        cycleTimeData,
        quantityData,
        defectTrendData,
        summary: {
          totalBaskets,
          avgCycleTime: totalBaskets ? Math.round((totalCycleTime / totalBaskets) * 100) / 100 : 0,
          totalLostTime: Math.round(totalLostTime * 100) / 100,
          totalGood,
          totalInspected,
          defectRate: totalInspected ? Math.round(((totalInspected - totalGood) / totalInspected) * 10000) / 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error("ElogbookReports GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
