// /app/api/assignment/updateStatus/route.js or route.ts

import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';

export async function PUT(request,{ params }) {
  await connectToDB();

  try {
    const {  status, reason } = await request.json();
const assignmentId = params.id;

    if (!assignmentId || !status) {
      return NextResponse.json(
        { success: false, message: 'assignmentId and status are required' },
        { status: 400 }
      );
    }
    console.log(status)

    const updateFields = { status };

    // Include reason if provided
    if (reason) {
      updateFields.reason = reason;
    }
console.log(updateFields)
    const updatedAssignment = await NewAssignment.findByIdAndUpdate(
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
