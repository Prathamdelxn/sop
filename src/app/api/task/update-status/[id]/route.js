// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectDB from "@/utils/db"; // Your MongoDB connection utility
// import Prototype from "@/model/Task"; // The model you shared

// // PATCH /api/prototype/update-status/[id]
// export async function PATCH(request, { params }) {
//   await connectDB();

//   const { id } = params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid prototype ID" }, { status: 400 });
//   }

//   try {
//     const body = await request.json();
//     const { status } = body;

//     if (!status) {
//       return NextResponse.json({ error: "Status is required" }, { status: 400 });
//     }

//     const updatedPrototype = await Prototype.findByIdAndUpdate(
//       id,
//       { status, updatedAt: new Date() },
//       { new: true }
//     );

//     if (!updatedPrototype) {
//       return NextResponse.json({ error: "Prototype not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Status updated", prototype: updatedPrototype });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import Prototype from "@/model/Task";

// PATCH /api/prototype/update-status/[id]
export async function PATCH(request, { params }) {
  await connectDB();

  const { id } =await params;

 console.log(id);

  try {
    const body = await request.json();
    const { status, rejectionReason } = body;

   console.log(status);
   console.log(body);

    
  

    const updateData = {
      status,
      updatedAt: new Date(),
    };

    // If rejected, add reason
    if (status === "Rejected") {
      if (!rejectionReason || rejectionReason.trim() === "") {
        return NextResponse.json({ error: "Rejection reason is required for rejected status" }, { status: 400 });
      }
      updateData.rejectionReason = rejectionReason;
    } else {
      // Clear rejection reason if approved or any other status
      updateData.rejectionReason = null;
    }
console.log(updateData);
console.log(id);
    const updatedPrototype = await Prototype.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPrototype) {
      return NextResponse.json({ error: "Prototype not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated successfully", prototype: updatedPrototype });
  } catch (error) {
    console.error("Error updating prototype status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
