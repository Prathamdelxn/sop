// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import SuperAdmin from "@/model/SuperAdmin";

// export const dynamic = "force-dynamic";

// export async function PUT(req) {
//   await connectDB();

//   try {
//     const { superadminId, oldRoleTitle, workerRole } = await req.json();

//     // Validation
//     if (!superadminId || !oldRoleTitle || !workerRole?.title) {
//       return NextResponse.json(
//         { success: false, message: "superadminId, oldRoleTitle, and workerRole are required" },
//         { status: 400 }
//       );
//     }

//     // Find superadmin
//     const superAdmin = await SuperAdmin.findById(superadminId);
//     if (!superAdmin) {
//       return NextResponse.json(
//         { success: false, message: "SuperAdmin not found" },
//         { status: 404 }
//       );
//     }

//     // Find role index
//     const roleIndex = superAdmin.workerRole.findIndex(
//       role => role.title === oldRoleTitle
//     );

//     if (roleIndex === -1) {
//       return NextResponse.json(
//         { success: false, message: "Role not found" },
//         { status: 404 }
//       );
//     }

//     // Update role
//     superAdmin.workerRole[roleIndex] = {
//       title: workerRole.title,
//       task: workerRole.task || []
//     };

//     await superAdmin.save();

//     return NextResponse.json({
//       success: true,
//       message: "Role updated successfully",
//       updatedRole: superAdmin.workerRole[roleIndex]
//     });

//   } catch (error) {
//     console.error("Error updating role:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // Block other methods
// export async function GET() {
//   return NextResponse.json(
//     { success: false, message: "Method not allowed" },
//     { status: 405 }
//   );
// }

// export async function POST() {
//   return NextResponse.json(
//     { success: false, message: "Method not allowed" },
//     { status: 405 }
//   );
// }


import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import User from "@/model/User"; // Import your User model

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

    // Find superadmin to get companyId
    const superAdmin = await SuperAdmin.findById(superadminId);
    if (!superAdmin) {
      return NextResponse.json(
        { success: false, message: "SuperAdmin not found" },
        { status: 404 }
      );
    }

    // Find role index
    const roleIndex = superAdmin.workerRole.findIndex(
      role => role.title === oldRoleTitle
    );

    if (roleIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Role not found" },
        { status: 404 }
      );
    }

    // Update role in SuperAdmin
    superAdmin.workerRole[roleIndex] = {
      title: workerRole.title,
      task: workerRole.task || []
    };

    await superAdmin.save();
console.log(superAdmin._id.toString()); // "68832664ae88c7c51c8595e5"

    // Update all users with this companyId and role
    const updateResult = await User.updateMany(
      {
        companyId: superAdmin._id.toString(),
    role: oldRoleTitle.toLowerCase()

      },
      {
        $set: {
          task: workerRole.task || [],
          role: workerRole.title // Update role title if it was changed
        }
      }
    );
console.log(updateResult);
    return NextResponse.json({
      success: true,
      message: "Role and user tasks updated successfully",
      updatedRole: superAdmin.workerRole[roleIndex],
      usersUpdated: updateResult.modifiedCount
    });

  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}