import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBasket from "@/model/ElogbookBasket";
import ElogbookQC from "@/model/ElogbookQC";
import ElogbookMasterData from "@/model/ElogbookMasterData";
export const dynamic = "force-dynamic";

// GET — aggregated report data for charts
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const masterDataId = searchParams.get("masterDataId");

    console.log("Reports API called with params:", { companyId, startDate, endDate, masterDataId });

    if (!companyId) {
      return NextResponse.json({
        success: false,
        message: "companyId required"
      }, { status: 400 });
    }

    // Build basket filter
    const basketFilter = { companyId };
    if (masterDataId && masterDataId !== "") {
      basketFilter.masterDataId = masterDataId;
    }

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

    console.log("Basket filter:", JSON.stringify(basketFilter, null, 2));

    // Fetch baskets
    const baskets = await ElogbookBasket.find(basketFilter)
      .populate("masterDataId")
      .sort({ basketNumber: 1 });

    console.log(`Found ${baskets.length} baskets`);

    // Fetch QC records for these baskets
    const basketIds = baskets.map(b => b._id);
    let qcRecords = [];
    if (basketIds.length > 0) {
      qcRecords = await ElogbookQC.find({ basketId: { $in: basketIds } });
      console.log(`Found ${qcRecords.length} QC records`);
    }

    // Map QC by basketId
    const qcMap = {};
    qcRecords.forEach(qc => {
      qcMap[qc.basketId.toString()] = qc;
    });

    // Build chart data
    const cycleTimeData = [];
    const quantityData = [];
    const basketDetails = [];
    let totalDefects = {
      watermark1: 0,
      watermark2: 0,
      maskingProblem: 0,
      scratchMark: 0,
      pvcPeelOff: 0
    };

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
        standard: standard,
        lost: basket.totalLostTime || 0,
        exceeds: (basket.actualCycleTime || 0) > standard,
      });

      const qc = qcMap[basket._id.toString()];
      const totalParts = basket.masterDataId?.partsPerBasket || 0;

      if (qc) {
        const goodQty = qc.finalGoodQuantity || qc.goodQuantity || 0;
        const reworkQty = qc.reworkQuantity || 0;
        const rejectedQty = qc.permanentRejections || 0;

        quantityData.push({
          name: label,
          good: goodQty,
          defective: reworkQty,
          rejected: rejectedQty,
          inspected: qc.inspectedQuantity || 0,
          totalParts: totalParts,
        });

        // Aggregate defects
        if (qc.defects) {
          Object.keys(totalDefects).forEach(key => {
            totalDefects[key] += qc.defects[key] || 0;
          });
        }

        totalGood += goodQty;
        totalInspected += qc.inspectedQuantity || 0;
      } else {
        // Push empty data for baskets without QC
        quantityData.push({
          name: label,
          good: 0,
          defective: 0,
          rejected: 0,
          inspected: 0,
          totalParts: totalParts,
        });
      }

      // Build basket-specific defects
      const basketDefects = [];
      if (qc && qc.defects) {
        const d = qc.defects.toObject ? qc.defects.toObject() : qc.defects;
        ["watermark1", "watermark2", "maskingProblem", "scratchMark", "pvcPeelOff"].forEach(key => {
          const val = d[key] || 0;
          if (val > 0) {
            basketDefects.push({
              name: key === "watermark1" ? "Watermark 1"
                  : key === "watermark2" ? "Watermark 2"
                  : key === "maskingProblem" ? "Masking Problem"
                  : key === "scratchMark" ? "Scratch Mark"
                  : "PVC Peel Off",
              count: val
            });
          }
        });
      }

      // Add detailed basket info
      basketDetails.push({
        doneBy: basket.endUser || basket.startUser || "-",
        qualityCheckedBy: qc ? qc.inspectorName : "-",
        totalParts: basket.masterDataId?.partsPerBasket || 0,
        defects: basketDefects
      });

      totalBaskets++;
      totalCycleTime += basket.actualCycleTime || 0;
      totalLostTime += basket.totalLostTime || 0;
    });

    const defectTrendData = Object.entries(totalDefects)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: key === "watermark1" ? "Watermark 1"
          : key === "watermark2" ? "Watermark 2"
            : key === "maskingProblem" ? "Masking Problem"
              : key === "scratchMark" ? "Scratch Mark"
                : "PVC Peel Off",
        count: value,
      }));

    const responseData = {
      success: true,
      data: {
        cycleTimeData,
        quantityData,
        basketDetails,
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
    };

    console.log("Sending response with data lengths:", {
      cycleTimeData: cycleTimeData.length,
      quantityData: quantityData.length,
      defectTrendData: defectTrendData.length
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("ElogbookReports GET error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error",
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Allow': 'GET, OPTIONS',
    },
  });
}