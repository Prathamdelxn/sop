// C:\Users\Admin\Desktop\SOP-Final\sop\src\app\api\elogbook\master-data\route.js

import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookMasterData from "@/model/ElogbookMasterData";

export const dynamic = "force-dynamic";

// GET — fetch all master data for a specific company
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const customerName = searchParams.get("customerName"); // Optional filter

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    let query = { companyId };
    if (customerName) {
      query.customerName = customerName;
    }

    const records = await ElogbookMasterData.find(query).sort({ customerName: 1, partName: 1 });
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("ElogbookMasterData GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create new master data record
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      companyId, customerName, partName,
      standardCycleTime, partsPerBasket
    } = body;

    if (!companyId || !customerName || !partName || !standardCycleTime || !partsPerBasket) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if part already exists for this customer
    const existingPart = await ElogbookMasterData.findOne({
      companyId,
      customerName,
      partName
    });

    if (existingPart) {
      return NextResponse.json({
        success: false,
        message: `Part "${partName}" already exists for customer "${customerName}"`
      }, { status: 409 });
    }

    const record = await ElogbookMasterData.create({
      ...body,
      basketCount: body.basketCount || 3,
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("ElogbookMasterData POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}