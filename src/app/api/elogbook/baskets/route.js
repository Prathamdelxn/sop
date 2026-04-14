import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBasket from "@/model/ElogbookBasket";

export const dynamic = "force-dynamic";

// GET — fetch baskets with optional filters
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const date = searchParams.get("date");
    const masterDataId = searchParams.get("masterDataId");
    const status = searchParams.get("status");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    const filter = { companyId };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    if (masterDataId) filter.masterDataId = masterDataId;
    if (status) filter.status = status;

    const baskets = await ElogbookBasket.find(filter)
      .populate("masterDataId")
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

    if (!companyId || !masterDataId || !basketNumber) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const basket = await ElogbookBasket.create({
      companyId,
      masterDataId,
      basketNumber,
      barcode: barcode || `BASKET-${basketNumber}`,
      date: new Date(),
      startTime: new Date(),
      startUser: startUser || "",
      additionalUsers: additionalUsers || [],
      status: "in-progress",
    });

    const populated = await ElogbookBasket.findById(basket._id).populate("masterDataId");
    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("ElogbookBasket POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
