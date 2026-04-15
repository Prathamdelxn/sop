import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import User from "@/model/User";
import Company from "@/model/Company";
import { migrateLegacyPermissions } from "@/utils/featurePermissions";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  await connectDB();

  try {
    const { superadminId, oldRoleTitle, workerRole } = await req.json();

    // Validation
    if (!superadminId || !oldRoleTitle || !workerRole?.title) {
      return NextResponse.json(
        { success: false, message: "superadminId, oldRoleTitle, and workerRole are required" },
        { status: 400 }
      );
    }

    console.log("Step 1: Finding SuperAdmin with ID:", superadminId);

    // Find superadmin to get company reference
    const superAdmin = await SuperAdmin.findById(superadminId);
    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: "SuperAdmin not found" },
        { status: 404 }
      );
    }

    console.log("Step 2: SuperAdmin found. CompanyId field:", superAdmin.companyId);
    console.log("SuperAdmin structure:", {
      id: superAdmin._id,
      companyId: superAdmin.companyId,
      companyIdType: typeof superAdmin.companyId,
      hasWorkerRole: !!superAdmin.workerRole,
      workerRoleLength: superAdmin.workerRole?.length
    });

    // Try different ways to find the company
    let company = null;

    // Try 1: If superAdmin.companyId is a MongoDB ObjectId
    if (superAdmin.companyId && mongoose.Types.ObjectId.isValid(superAdmin.companyId)) {
      company = await Company.findById(superAdmin.companyId);
      console.log("Try 1 - Company.findById result:", !!company);
    }

    // Try 2: If superAdmin.companyId is a string slug
    if (!company && superAdmin.companyId) {
      company = await Company.findOne({ companyId: superAdmin.companyId });
      console.log("Try 2 - Company.findOne({ companyId }) result:", !!company);
    }

    // Try 3: If superAdmin has a reference to Company via _id
    if (!company) {
      company = await Company.findOne({ _id: superAdmin.companyId });
      console.log("Try 3 - Company.findOne({ _id }) result:", !!company);
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          message: "Company not found for this SuperAdmin",
          debug: {
            superAdminCompanyId: superAdmin.companyId,
            superAdminCompanyIdType: typeof superAdmin.companyId
          }
        },
        { status: 404 }
      );
    }

    console.log("Step 3: Company found. Company ID slug:", company.companyId);

    // Find role index in SuperAdmin
    const roleIndex = superAdmin.workerRole.findIndex(
      role => role.title === oldRoleTitle
    );

    if (roleIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Role not found" },
        { status: 404 }
      );
    }

    console.log("Step 4: Role found at index:", roleIndex);

    // Auto-migrate legacy permissions
    const migratedTasks = migrateLegacyPermissions(workerRole.task || []);

    // Update role in SuperAdmin
    superAdmin.workerRole[roleIndex] = {
      title: workerRole.title,
      task: migratedTasks
    };

    superAdmin.markModified("workerRole");
    await superAdmin.save();

    console.log("Step 5: SuperAdmin updated successfully");

    // Generate role formats
    const oldRoleFormatted = oldRoleTitle.toLowerCase().replace(/\s+/g, '-');
    const newRoleFormatted = workerRole.title.toLowerCase().replace(/\s+/g, '-');

    console.log("Step 6: Updating users with:", {
      companyId: company.companyId,
      oldRole: oldRoleFormatted,
      newRole: newRoleFormatted,
      taskCount: migratedTasks.length
    });

    // Update users using the company's companyId (slug)
    const updateResult = await User.updateMany(
      {
        companyId: company.companyId,
        role: oldRoleFormatted
      },
      {
        $set: {
          role: newRoleFormatted,
          task: migratedTasks,
        }
      }
    );

    console.log("Step 7: User update result:", updateResult);

    return NextResponse.json({
      success: true,
      message: "Role and user tasks updated successfully",
      updatedRole: superAdmin.workerRole[roleIndex],
      usersMatched: updateResult.matchedCount,
      usersModified: updateResult.modifiedCount,
      companyId: company.companyId
    });

  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}