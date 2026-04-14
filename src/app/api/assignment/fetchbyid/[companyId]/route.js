import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json({ message: 'companyId is required' }, { status: 400 });
    }

    const AssignmentModel = getTenantModel("NewAssignment", companyId);
    const assignments = await AssignmentModel.find({});
    
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
