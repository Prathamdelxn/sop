import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";
 
export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const { companyId, id: assignmentId } = await params;

    if (!companyId || !assignmentId) {
      return NextResponse.json(
        { success: false, message: 'companyId and assignmentId are required' },
        { status: 400 }
      );
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;
    const deletedAssignment = await AssignmentModel.findByIdAndDelete(assignmentId);
 
    if (!deletedAssignment) {
      return NextResponse.json(
        { success: false, message: 'Assignment not found' },
        { status: 404 }
      );
    }
 
    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully',
      data: deletedAssignment,
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
