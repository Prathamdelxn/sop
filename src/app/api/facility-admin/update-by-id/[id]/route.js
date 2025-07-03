import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import FacilityAdmin from "@/model/FacilityAdmin";
import bcrypt from "bcryptjs";

// Handle CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// PUT /api/facility-admin/update/:id
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const updates = await req.json();

    // Prevent email change if needed (optional rule)
    // delete updates.email;

    // Re-hash password if being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Update the FacilityAdmin
    const updated = await FacilityAdmin.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Facility Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Facility Admin updated successfully",
      facilityAdmin: {
        //id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        location: updated.location,
        role: updated.role,
        status: updated.status,
      },
    });

  } catch (error) {
    console.error("Facility Admin update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
