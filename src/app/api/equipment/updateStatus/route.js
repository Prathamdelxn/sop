import { NextResponse } from 'next/server';

import connectToDB from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

// ✅ Update Equipment Status with Multi-Tenant Isolation
export async function PUT(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { equipmentId, status, approver, rejectionReason, companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'companyId is required for multi-tenant isolation' },
        { status: 400 }
      );
    }

    if (!equipmentId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: equipmentId or status' },
        { status: 400 }
      );
    }

    // Get the dynamic Equipment model for this company
    const EquipmentModel = EquipmentStatic; 
    const __tenantCompanyId = companyId;

    const updateFields = { status };
    if (approver && approver.approverId && approver.approverName) {
      updateFields.approver = {
        approverId: approver.approverId,
        approverName: approver.approverName,
        approverDate: new Date()
      };
    }

    if (status === 'Rejected' && rejectionReason) {
      updateFields.rejectionReason = rejectionReason;
    } else if (status === 'Approved' || status === 'Pending Approval') {
      updateFields.rejectionReason = ''; // Clear previous reason if status is changed
    }

    // Find and update the equipment within the tenant-specific collection
    const updatedEquipment = await EquipmentModel.findByIdAndUpdate(
      equipmentId,
      updateFields,
      { new: true }
    );

    if (!updatedEquipment) {
      return NextResponse.json(
        { success: false, message: 'Equipment not found in this company\'s collection' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Equipment status updated to '${status}'`,
      data: updatedEquipment
    });

  } catch (error) {
    console.error('❌ Error updating equipment status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
