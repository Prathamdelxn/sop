import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
 
export async function DELETE(request, { params }) {
  await connectToDB();
 
  const assignmentId = params.id;
 
  try {
    const deletedAssignment = await NewAssignment.findByIdAndDelete(assignmentId);
 
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
 