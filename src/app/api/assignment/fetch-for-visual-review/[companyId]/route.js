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

    // Fetch assignments that are pending visual review
    const assignments = await AssignmentModel.find({
      $or: [
        { status: 'Pending Visual Review' },
        { visualReviewStatus: 'Pending Visual Review' }
      ]
    }).sort({ assignedAt: -1 });

    return NextResponse.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Error fetching assignments for visual review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
