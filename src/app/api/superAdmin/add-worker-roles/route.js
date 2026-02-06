import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  await connectDB();

  try {
    const { superadminId, workerRole } = await req.json();
    

   

    const superAdmin = await SuperAdmin.findById(superadminId);
    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: "SuperAdmin not found" },
        { status: 404 }
      );
    }
console.log(workerRole);
    // Push new role into the existing workerRole array
    superAdmin.workerRole.push(workerRole);
    await superAdmin.save();

    return NextResponse.json({
      success: true,
      message: "Worker role added successfully",
      superAdmin,
    });
  } catch (error) {
    console.error("Error adding worker role:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
