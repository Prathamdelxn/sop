import { NextResponse } from 'next/server';
import { getTenantModel } from '@/utils/tenantDb';
import connectToDB from '@/utils/db';

// ✅ Update Equipment Barcode with Multi-Tenant Isolation
export async function PUT(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { equipmentId, barcodeUrl, companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required for multi-tenant isolation' },
        { status: 400 }
      );
    }

    if (!equipmentId) {
      return NextResponse.json(
        { error: 'equipmentId is required' },
        { status: 400 }
      );
    }

    // Get the dynamic Equipment model for this company
    const EquipmentModel = getTenantModel("Equipment", companyId);

    // Update the barcode within the tenant-specific collection
    const updatedEquipment = await EquipmentModel.findByIdAndUpdate(
      equipmentId,
      { barcode: barcodeUrl },
      { new: true }
    );

    if (!updatedEquipment) {
      return NextResponse.json(
        { error: 'Equipment not found in this company\'s collection' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Barcode updated successfully',
      data: updatedEquipment
    });
  } catch (error) {
    console.error('❌ Error updating barcode:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}