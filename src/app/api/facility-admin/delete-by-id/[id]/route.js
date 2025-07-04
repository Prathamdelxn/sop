import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import FacilityAdmin from "@/model/FacilityAdmin";

// Handle CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// DELETE /api/facility-admin/delete/:id
export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const deleted = await FacilityAdmin.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Facility Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Facility Admin deleted successfully",
      deletedId: deleted._id,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
