import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import ElogbookBasket from "@/model/ElogbookBasket";

export const dynamic = "force-dynamic";

// GET — fetch single basket
export async function GET(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const basket = await ElogbookBasket.findById(id).populate("masterDataId");

    if (!basket) {
      return NextResponse.json({ success: false, message: "Basket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: basket });
  } catch (error) {
    console.error("ElogbookBasket GET [id] error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT — update basket (stop, restart, end, etc.)
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    const basket = await ElogbookBasket.findById(id);
    if (!basket) {
      return NextResponse.json({ success: false, message: "Basket not found" }, { status: 404 });
    }

    switch (action) {
      case "stop": {
        // Add a new stoppage entry
        basket.stoppages.push({
          stopTime: new Date(),
          reason: body.reason || "",
        });
        basket.status = "stopped";
        break;
      }

      case "restart": {
        // Find the latest stoppage without restart and fill it
        const lastStop = basket.stoppages.find(s => !s.restartTime);
        if (lastStop) {
          lastStop.restartTime = new Date();
          lastStop.lostMinutes = (new Date(lastStop.restartTime) - new Date(lastStop.stopTime)) / 60000;
        }
        basket.status = "in-progress";
        break;
      }

      case "end": {
        basket.endTime = new Date();
        basket.endUser = body.endUser || "";

        // Close any open stoppages
        basket.stoppages.forEach(s => {
          if (!s.restartTime) {
            s.restartTime = basket.endTime;
            s.lostMinutes = (new Date(s.restartTime) - new Date(s.stopTime)) / 60000;
          }
        });

        // Calculate totals
        const totalLost = basket.stoppages.reduce((sum, s) => sum + (s.lostMinutes || 0), 0);
        const totalElapsed = (new Date(basket.endTime) - new Date(basket.startTime)) / 60000;
        basket.totalLostTime = Math.round(totalLost * 100) / 100;
        basket.actualCycleTime = Math.round((totalElapsed - totalLost) * 100) / 100;
        basket.status = "pending-qc";
        break;
      }

      case "update": {
        // Generic field updates
        const allowedFields = ["additionalUsers", "barcode"];
        allowedFields.forEach(field => {
          if (body[field] !== undefined) basket[field] = body[field];
        });
        break;
      }

      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    await basket.save();
    const populated = await ElogbookBasket.findById(id).populate("masterDataId");
    return NextResponse.json({ success: true, data: populated });
  } catch (error) {
    console.error("ElogbookBasket PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
