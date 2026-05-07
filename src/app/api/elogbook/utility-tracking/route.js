import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import UtilityTracking from "@/model/UtilityTracking";

export const dynamic = "force-dynamic";

// GET — Fetch daily utility tracking record for a specific plant and date
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const plantId = searchParams.get("plantId");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!companyId || !plantId) {
      return NextResponse.json({ success: false, message: "companyId and plantId are required" }, { status: 400 });
    }

    const record = await UtilityTracking.findOne({ companyId, plantId, date })
      .populate("plantId", "name code")
      .populate("startUser.id", "name username")
      .populate("endUser.id", "name username");

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("UtilityTracking GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — Start the day or save progress
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { 
      companyId, 
      plantId, 
      date, 
      startUser, 
      operationTimes, 
      ovenConveyorTimings, 
      utilityReadings,
      operatorDetails 
    } = body;

    if (!companyId || !plantId || !date) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Upsert the record for the day
    const record = await UtilityTracking.findOneAndUpdate(
      { companyId, plantId, date },
      {
        $set: {
          companyId,
          plantId,
          date,
          operationTimes,
          ovenConveyorTimings,
          utilityReadings,
          operatorDetails,
          startUser,
          status: "started"
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("UtilityTracking POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH — End the day
export async function PATCH(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { 
      companyId, 
      plantId, 
      date, 
      endUser,
      lineConsumptions,
      otherConsumables,
      utilityReadings // Final utility readings (closing)
    } = body;

    if (!companyId || !plantId || !date) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const record = await UtilityTracking.findOneAndUpdate(
      { companyId, plantId, date },
      {
        $set: {
          endUser,
          lineConsumptions,
          otherConsumables,
          utilityReadings, // Update with closing readings
          endTime: new Date(),
          status: "completed"
        }
      },
      { new: true }
    );

    if (!record) {
      return NextResponse.json({ success: false, message: "No active record found for today to end." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("UtilityTracking PATCH error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
