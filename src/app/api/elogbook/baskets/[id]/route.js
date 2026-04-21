// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import ElogbookBasket from "@/model/ElogbookBasket";

// export const dynamic = "force-dynamic";

// // GET — fetch single basket
// export async function GET(req, { params }) {
//   await connectDB();
//   try {
//     const { id } = await params;
//     const basket = await ElogbookBasket.findById(id).populate("masterDataId");

//     if (!basket) {
//       return NextResponse.json({ success: false, message: "Basket not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: basket });
//   } catch (error) {
//     console.error("ElogbookBasket GET [id] error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

// // PUT — update basket (stop, restart, end, etc.)
// export async function PUT(req, { params }) {
//   await connectDB();
//   try {
//     const { id } = await params;
//     const body = await req.json();
//     const { action } = body;

//     const basket = await ElogbookBasket.findById(id);
//     if (!basket) {
//       return NextResponse.json({ success: false, message: "Basket not found" }, { status: 404 });
//     }

//     switch (action) {
//       case "stop": {
//         // Add a new stoppage entry
//         basket.stoppages.push({
//           stopTime: new Date(),
//           reason: body.reason || "",
//         });
//         basket.status = "stopped";
//         break;
//       }

//       case "restart": {
//         // Find the latest stoppage without restart and fill it
//         const lastStop = basket.stoppages.find(s => !s.restartTime);
//         if (lastStop) {
//           lastStop.restartTime = new Date();
//           lastStop.lostMinutes = (new Date(lastStop.restartTime) - new Date(lastStop.stopTime)) / 60000;
//         }
//         basket.status = "in-progress";
//         break;
//       }

//       case "end": {
//         basket.endTime = new Date();
//         basket.endUser = body.endUser || "";

//         // Close any open stoppages
//         basket.stoppages.forEach(s => {
//           if (!s.restartTime) {
//             s.restartTime = basket.endTime;
//             s.lostMinutes = (new Date(s.restartTime) - new Date(s.stopTime)) / 60000;
//           }
//         });

//         // Calculate totals
//         const totalLost = basket.stoppages.reduce((sum, s) => sum + (s.lostMinutes || 0), 0);
//         const totalElapsed = (new Date(basket.endTime) - new Date(basket.startTime)) / 60000;
//         basket.totalLostTime = Math.round(totalLost * 100) / 100;
//         basket.actualCycleTime = Math.round((totalElapsed - totalLost) * 100) / 100;
//         basket.status = "pending-qc";
//         break;
//       }

//       case "update": {
//         // Generic field updates
//         const allowedFields = ["additionalUsers", "barcode"];
//         allowedFields.forEach(field => {
//           if (body[field] !== undefined) basket[field] = body[field];
//         });
//         break;
//       }

//       default:
//         return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
//     }

//     await basket.save();
//     const populated = await ElogbookBasket.findById(id).populate("masterDataId");
//     return NextResponse.json({ success: true, data: populated });
//   } catch (error) {
//     console.error("ElogbookBasket PUT error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


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
          restartTime: null,
          lostMinutes: 0 // Will be calculated when restarting
        });
        basket.status = "stopped";
        break;
      }

      case "restart": {
        // Find the latest stoppage without restart and fill it
        const lastStop = basket.stoppages.find(s => !s.restartTime);
        if (lastStop) {
          const restartTime = new Date();
          const stopTime = new Date(lastStop.stopTime);

          // Calculate lost time in minutes with high precision
          const lostMilliseconds = restartTime - stopTime;
          const lostMinutes = lostMilliseconds / 1000 / 60;

          lastStop.restartTime = restartTime;
          lastStop.lostMinutes = parseFloat(lostMinutes.toFixed(3)); // Keep 3 decimal places for seconds precision

          // Recalculate total lost time for the basket so far
          let totalLostMilliseconds = 0;
          basket.stoppages.forEach(s => {
            if (s.restartTime) {
              const stopDt = new Date(s.stopTime);
              const restartDt = new Date(s.restartTime);
              totalLostMilliseconds += (restartDt - stopDt);
            }
          });

          // Update basket's total lost time (in minutes)
          basket.totalLostTime = parseFloat((totalLostMilliseconds / 1000 / 60).toFixed(3));

          // Update actual cycle time based on current elapsed time
          const now = new Date();
          const startTime = new Date(basket.startTime);
          const elapsedMilliseconds = now - startTime;
          const actualMilliseconds = elapsedMilliseconds - totalLostMilliseconds;
          basket.actualCycleTime = parseFloat((actualMilliseconds / 1000 / 60).toFixed(3));
        }
        basket.status = "in-progress";
        break;
      }

      case "end": {
        const endTime = new Date();
        basket.endTime = endTime;
        basket.endUser = body.endUser || "";

        let totalLostMilliseconds = 0;

        // Close any open stoppages and calculate total lost time in milliseconds
        basket.stoppages.forEach(s => {
          if (!s.restartTime) {
            // Close the current active stoppage
            const stopTime = new Date(s.stopTime);
            const lostMilliseconds = endTime - stopTime;
            s.restartTime = endTime;
            s.lostMinutes = parseFloat((lostMilliseconds / 1000 / 60).toFixed(3));
            totalLostMilliseconds += lostMilliseconds;
          } else if (s.restartTime && s.lostMinutes > 0) {
            // For completed stoppages, calculate in milliseconds for precision
            const stopDt = new Date(s.stopTime);
            const restartDt = new Date(s.restartTime);
            totalLostMilliseconds += (restartDt - stopDt);
          }
        });

        // Calculate total elapsed time in milliseconds
        const startTime = new Date(basket.startTime);
        const totalElapsedMilliseconds = endTime - startTime;

        // Calculate actual cycle time
        const actualMilliseconds = totalElapsedMilliseconds - totalLostMilliseconds;

        // Convert to minutes with 2 decimal places for storage
        const totalLostMinutes = totalLostMilliseconds / 1000 / 60;
        const actualCycleMinutes = actualMilliseconds / 1000 / 60;

        basket.totalLostTime = parseFloat(totalLostMinutes.toFixed(2));
        basket.actualCycleTime = parseFloat(actualCycleMinutes.toFixed(2));
        basket.status = "pending-qc";

        // Optional: Add a debug log to verify calculations
        console.log("=== Basket Calculation Debug ===");
        console.log(`Start Time: ${startTime.toLocaleTimeString()}`);
        console.log(`End Time: ${endTime.toLocaleTimeString()}`);
        console.log(`Total Elapsed: ${(totalElapsedMilliseconds / 1000).toFixed(1)} seconds (${(totalElapsedMilliseconds / 1000 / 60).toFixed(2)} minutes)`);
        console.log(`Total Lost: ${(totalLostMilliseconds / 1000).toFixed(1)} seconds (${totalLostMinutes.toFixed(2)} minutes)`);
        console.log(`Actual Cycle: ${(actualMilliseconds / 1000).toFixed(1)} seconds (${actualCycleMinutes.toFixed(2)} minutes)`);
        console.log(`Stoppages Count: ${basket.stoppages.length}`);
        basket.stoppages.forEach((s, idx) => {
          console.log(`  Stoppage ${idx + 1}: ${s.lostMinutes.toFixed(2)} minutes (${(s.lostMinutes * 60).toFixed(1)} seconds) - ${s.reason}`);
        });
        console.log("==============================");

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

    // Return calculation details in response for frontend debugging
    const responseData = {
      success: true,
      data: populated
    };

    // Add calculation details for "end" action
    if (action === "end") {
      responseData.calculation = {
        actualCycleSeconds: (populated.actualCycleTime * 60).toFixed(1),
        actualCycleMinutes: populated.actualCycleTime,
        totalLostSeconds: (populated.totalLostTime * 60).toFixed(1),
        totalLostMinutes: populated.totalLostTime
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("ElogbookBasket PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}