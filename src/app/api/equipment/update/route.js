import connectDB from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';
import { NextResponse } from 'next/server';

// ✅ Update Equipment with Multi-Tenant Isolation
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { equipmentIds, companyId, ...updateData } = body;

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'companyId is required for multi-tenant isolation' },
        { status: 400 }
      );
    }

    if (!equipmentIds) {
      return NextResponse.json(
        { success: false, message: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    // Get the dynamic Equipment model for this company
    const EquipmentModel = getTenantModel("Equipment", companyId);

    // Find the equipment and update it within the tenant-specific collection
    const updatedEquipment = await EquipmentModel.findByIdAndUpdate(
      equipmentIds,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedEquipment) {
      return NextResponse.json(
        { success: false, message: 'Equipment not found in this company\'s collection' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedEquipment, message: 'Equipment updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error updating equipment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}