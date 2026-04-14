import connectDB from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'Company ID is required' },
        { status: 400 }
      );
    }

    const AssignmentModel = getTenantModel("NewAssignment", companyId);

    // Fetch assignments that are pending review or have rework required
    // companyId filter is implicit in the collection name
    const assignments = await AssignmentModel.find({
      $or: [
        { status: 'Pending Review' },
        { reviewStatus: 'Pending Review' },
        { status: 'Rework Required' },
        { reviewStatus: 'Rework Required' }
      ]
    }).sort({ assignedAt: -1 });

    return NextResponse.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Error fetching assignments for review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
