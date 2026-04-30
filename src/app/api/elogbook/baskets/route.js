import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBasket from "@/model/ElogbookBasket";
import ElogbookBatch from "@/model/ElogbookBatch";




// GET — fetch baskets with optional filters
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const masterDataId = searchParams.get("masterDataId");
    const batchId = searchParams.get("batchId");
    const plantId = searchParams.get("plantId");
    const lineId = searchParams.get("lineId");
    const status = searchParams.get("status");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const filter = { companyId };

    // Plant/Line filters
    if (plantId) filter.plantId = plantId;
    if (lineId) filter.lineId = lineId;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    } else if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        filter.date.$gte = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        filter.date.$lte = e;
      }
    }

    if (batchId) {
      filter.batchId = batchId;
    } else if (masterDataId && !startDate && !endDate && !date) {
      // If masterDataId is provided but no dates, find the active batch
      const batchFilter = { companyId, masterDataId, status: "in-progress" };
      if (plantId) batchFilter.plantId = plantId;
      if (lineId) batchFilter.lineId = lineId;

      const activeBatch = await ElogbookBatch.findOne(batchFilter);
      if (activeBatch) {
        filter.batchId = activeBatch._id;
      } else {
        // If no active batch, filter by masterDataId
        filter.masterDataId = masterDataId;
      }
    } else if (masterDataId) {
      filter.masterDataId = masterDataId;
    }

    if (status) {
      if (status.includes(",")) {
        filter.status = { $in: status.split(",") };
      } else {
        filter.status = status;
      }
    }

    const baskets = await ElogbookBasket.find(filter)
      .populate("masterDataId")
      .populate("batchId", "batchNumber plantId lineId")
      .populate("plantId", "name code")
      .populate("lineId", "lineNumber name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: baskets });
  } catch (error) {
    console.error("ElogbookBasket GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create / start a basket
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { companyId, masterDataId, basketNumber, barcode, startUser, additionalUsers } = body;

    if (!companyId || !masterDataId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Find active batch
    let activeBatch = null;
    if (body.batchId) {
      activeBatch = await ElogbookBatch.findById(body.batchId);
    } else {
      const batchFilter = { companyId, masterDataId, status: "in-progress" };
      if (body.plantId) batchFilter.plantId = body.plantId;
      if (body.lineId) batchFilter.lineId = body.lineId;
      activeBatch = await ElogbookBatch.findOne(batchFilter);
    }

    if (!activeBatch) {
      return NextResponse.json({ success: false, message: "No active batch found. Please start a batch first." }, { status: 400 });
    }

    // Auto-calculate basket number if not provided
    let finalBasketNumber = basketNumber;
    if (!finalBasketNumber) {
      const count = await ElogbookBasket.countDocuments({ batchId: activeBatch._id });
      finalBasketNumber = count + 1;
    }

    const basket = await ElogbookBasket.create({
      companyId,
      plantId: activeBatch.plantId || null,
      lineId: activeBatch.lineId || null,
      masterDataId,
      batchId: activeBatch._id,
      basketNumber: finalBasketNumber,
      barcode: barcode || `BASKET-${finalBasketNumber}-${activeBatch._id.toString().slice(-4)}`,
      date: new Date(),
      startTime: new Date(),
      startUser: startUser || "",
      additionalUsers: additionalUsers || [],
      status: "in-progress",
    });

    const populated = await ElogbookBasket.findById(basket._id)
      .populate("masterDataId")
      .populate("batchId", "batchNumber plantId lineId")
      .populate("plantId", "name code")
      .populate("lineId", "lineNumber name");

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("ElogbookBasket POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
