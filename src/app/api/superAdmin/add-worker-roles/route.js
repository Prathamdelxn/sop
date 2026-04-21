import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import { migrateLegacyPermissions } from "@/utils/featurePermissions";

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

    // Auto-migrate legacy permissions (e.g. "ElogBook" → 4 granular perms)
    const migratedRole = {
      ...workerRole,
      task: migrateLegacyPermissions(workerRole.task || []),
    };

    console.log("Adding role:", migratedRole);
    superAdmin.workerRole.push(migratedRole);
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
