import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { companyId, id: assignmentId } = await params;
    const { status, rejectionReason } = await request.json();

    if (!assignmentId || !status || !companyId) {
      return NextResponse.json(
        { success: false, message: 'companyId, assignmentId, and status are required' },
        { status: 400 }
      );
    }

    const AssignmentModel = getTenantModel("NewAssignment", companyId);

    const updateFields = { status };

    // Include reason if provided
    if (rejectionReason) {
      updateFields.rejectionReason = rejectionReason;
    }

    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
        assignmentId,
        updateFields,
        { new: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { success: false, message: 'Assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Assignment status updated to '${status}'`,
      data: updatedAssignment
    });

  } catch (error) {
    console.error('Error updating assignment status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
