import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { generatedId, equipment, prototype, companyId, userId } = body;

    // Validation
    if (!companyId) {
      return NextResponse.json({ success: false, message: "Company ID is required for data isolation" }, { status: 400 });
    }

    if (!generatedId || !equipment || !prototype) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (generatedId, equipment, or prototype)' },
        { status: 400 }
      );
    }

    // Get the dynamic NewAssignment model for this company
    const AssignmentModel = getTenantModel("NewAssignment", companyId);

    const newAssignment = await AssignmentModel.create({
      generatedId,
      equipment,
      prototypeData: prototype,
      companyId,
      userId
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment created successfully in tenant storage',
      data: newAssignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
