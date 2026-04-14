import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "Company ID is required" }, { status: 400 });
    }

    // Get the dynamic NewAssignment model for this company
    const AssignmentModel = getTenantModel("NewAssignment", companyId);

    const assignments = await AssignmentModel.find().sort({ assignedAt: -1 });

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch assignments',
    }, { status: 500 });
  }
}
