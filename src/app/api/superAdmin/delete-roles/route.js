import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import SuperAdmin from '@/model/SuperAdmin';
import User from '@/model/User';

export const dynamic = 'force-dynamic';

export async function DELETE(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { superadminId, roleTitle } = body;
    console.log(body);


    if (!superadminId || !roleTitle) {
      return NextResponse.json({ error: "superAdminId and roleTitle are required" }, { status: 400 });
    }

    // Step 1: Remove role from SuperAdmin's workerRole array
    const superAdmin = await SuperAdmin.findByIdAndUpdate(
      superadminId,
      {
        $pull: {
          workerRole: { title: roleTitle },
        },
      },
      { new: true }
    );

    if (!superAdmin) {
      return NextResponse.json({ error: "SuperAdmin not found" }, { status: 404 });
    }

    // Step 2: Delete all users with the same role and matching companyId
    const deletedUsers = await User.deleteMany({
      role: roleTitle,
      companyId: superadminId, // companyId in users refers to the superAdminId
    });

    return NextResponse.json({
      message: `Worker role '${roleTitle}' and related users deleted successfully`,
      deletedUsersCount: deletedUsers.deletedCount,
      updatedSuperAdmin: superAdmin,
    });
  } catch (err) {
    console.error("Error deleting worker role and users:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
