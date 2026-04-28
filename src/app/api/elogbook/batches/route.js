import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBatch from "@/model/ElogbookBatch";
import ElogbookBasket from "@/model/ElogbookBasket";
import Company from "@/model/Company";
import { generateBatchNumber } from "@/utils/batchNumberGenerator";

export const dynamic = "force-dynamic";

// GET — fetch active batch for a specific masterDataId (optionally scoped by plant/line)
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const masterDataId = searchParams.get("masterDataId");
    const plantId = searchParams.get("plantId");
    const lineId = searchParams.get("lineId");
    const status = searchParams.get("status") || "in-progress";

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const filter = { companyId, status };
    if (masterDataId) filter.masterDataId = masterDataId;
    if (plantId) filter.plantId = plantId;
    if (lineId) filter.lineId = lineId;

    const batch = await ElogbookBatch.findOne(filter)
      .populate("plantId", "name code")
      .populate("lineId", "lineNumber name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    console.error("ElogbookBatch GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — start a new batch
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { companyId, masterDataId, startUser, plantId, lineId } = body;

    if (!companyId || !masterDataId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Build the active-batch check filter (scoped by plant+line if provided)
    const activeFilter = { companyId, masterDataId, status: "in-progress" };
    if (plantId) activeFilter.plantId = plantId;
    if (lineId) activeFilter.lineId = lineId;

    // Check if there's already an active batch for this combination
    const existingActiveBatch = await ElogbookBatch.findOne(activeFilter);

    if (existingActiveBatch) {
      return NextResponse.json({ 
        success: false, 
        message: "A batch is already in progress for this part on this line. Please end it before starting a new one." 
      }, { status: 400 });
    }

    // Generate batch number
    let batchNumber = "";
    try {
      const company = await Company.findOne({ companyId });
      const companyCode = company?.code || companyId.slice(0, 2).toUpperCase();
      batchNumber = await generateBatchNumber(companyCode, new Date(), ElogbookBatch);
    } catch (err) {
      console.error("Batch number generation error:", err);
      // Fallback: use timestamp-based ID
      batchNumber = `B${Date.now().toString(36).toUpperCase()}`;
    }

    const batch = await ElogbookBatch.create({
      companyId,
      plantId: plantId || null,
      lineId: lineId || null,
      masterDataId,
      batchNumber,
      startTime: new Date(),
      startUser: startUser || "",
      status: "in-progress",
    });

    // Automatically create the first basket (Bucket 1)
    await ElogbookBasket.create({
      companyId,
      plantId: plantId || null,
      lineId: lineId || null,
      masterDataId,
      batchId: batch._id,
      basketNumber: 1,
      barcode: `BASKET-1-${batch._id.toString().slice(-4)}`,
      date: new Date(),
      startTime: new Date(),
      startUser: startUser || "",
      status: "in-progress",
    });

    // Re-fetch with populated refs
    const populated = await ElogbookBatch.findById(batch._id)
      .populate("plantId", "name code")
      .populate("lineId", "lineNumber name");

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("ElogbookBatch POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
