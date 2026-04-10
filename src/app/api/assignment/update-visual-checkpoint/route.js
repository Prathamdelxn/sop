import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();
    const { assignmentId, recordId, field, value, reviewerId, reviewerName } = await request.json();

    if (!assignmentId || recordId === undefined || !field || value === undefined) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    const assignment = await NewAssignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ success: false, message: 'Assignment not found' }, { status: 404 });
    }

    const visualRep = assignment.prototypeData?.visualRepresntation;
    if (!visualRep || !visualRep[recordId]) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    // field: "production" or "qa"
    visualRep[recordId][field] = value;

    // Also track who did it
    if (!visualRep[recordId].completedBy) visualRep[recordId].completedBy = {};
    visualRep[recordId].completedBy[field] = {
      id: reviewerId,
      name: reviewerName,
      at: new Date()
    };

    assignment.markModified('prototypeData.visualRepresntation');
    await assignment.save();

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error updating checkpoint:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
