import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBatch from "@/model/ElogbookBatch";
import ElogbookBasket from "@/model/ElogbookBasket";

export const dynamic = "force-dynamic";

// GET — fetch active batch for a specific masterDataId
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const masterDataId = searchParams.get("masterDataId");
    const status = searchParams.get("status") || "in-progress";

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const filter = { companyId, status };
    if (masterDataId) filter.masterDataId = masterDataId;

    const batch = await ElogbookBatch.findOne(filter).sort({ createdAt: -1 });

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
    const { companyId, masterDataId, startUser } = body;

    if (!companyId || !masterDataId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if there's already an active batch for this masterDataId
    const existingActiveBatch = await ElogbookBatch.findOne({
      companyId,
      masterDataId,
      status: "in-progress"
    });

    if (existingActiveBatch) {
      return NextResponse.json({ 
        success: false, 
        message: "A batch is already in progress for this part. Please end it before starting a new one." 
      }, { status: 400 });
    }

    const batch = await ElogbookBatch.create({
      companyId,
      masterDataId,
      startTime: new Date(),
      startUser: startUser || "",
      status: "in-progress",
    });

    // Automatically create the first basket (Bucket 1)
    await ElogbookBasket.create({
      companyId,
      masterDataId,
      batchId: batch._id,
      basketNumber: 1,
      barcode: `BASKET-1-${batch._id.toString().slice(-4)}`,
      date: new Date(),
      startTime: new Date(),
      startUser: startUser || "",
      status: "in-progress",
    });

    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error) {
    console.error("ElogbookBatch POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
