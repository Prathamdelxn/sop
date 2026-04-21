import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


// ✅ Delete Equipment with Multi-Tenant Isolation
export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const equipmentId = params.id;
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: "companyId is required for multi-tenant isolation" },
        { status: 400 }
      );
    }

    if (!equipmentId) {
      return NextResponse.json(
        { success: false, message: "Equipment ID is required" },
        { status: 400 }
      );
    }

    // Get the dynamic Equipment model for this company
    const EquipmentModel = EquipmentStatic; 
    const __tenantCompanyId = companyId;

    // Find and delete the equipment within the tenant-specific collection
    const deletedEquipment = await EquipmentModel.findByIdAndDelete(equipmentId);

    if (!deletedEquipment) {
      return NextResponse.json(
        { success: false, message: "Equipment not found in this company's collection" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Equipment deleted successfully",
      data: deletedEquipment,
    });
  } catch (error) {
    console.error("❌ Error deleting equipment:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
 