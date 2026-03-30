import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { assignmentId, sentBy } = body;

    if (!assignmentId || !sentBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: assignmentId, sentBy' },
        { status: 400 }
      );
    }

    const assignment = await NewAssignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { success: false, message: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Verify all tasks are completed
    const stages = assignment.prototypeData?.stages || [];
    let allCompleted = true;
    let incompleteTask = null;

    for (const stage of stages) {
      if (!stage.tasks) continue;
      for (const task of stage.tasks) {
        if (task.status !== 'completed') {
          allCompleted = false;
          incompleteTask = task.title || 'Untitled Task';
          break;
        }
        // Check subtasks too
        if (task.subtasks && task.subtasks.length > 0) {
          for (const subtask of task.subtasks) {
            if (subtask.status !== 'completed') {
              allCompleted = false;
              incompleteTask = subtask.title || 'Untitled Subtask';
              break;
            }
          }
        }
        if (!allCompleted) break;
      }
      if (!allCompleted) break;
    }

    if (!allCompleted) {
      return NextResponse.json(
        { success: false, message: `Cannot send for review. Task "${incompleteTask}" is not completed yet.` },
        { status: 400 }
      );
    }

    // Update assignment status
    assignment.status = 'Pending Review';
    assignment.reviewStatus = 'Pending Review';
    assignment.reviewNotes = []; // Clear previous review notes
    assignment.markModified('prototypeData');
    await assignment.save();

    return NextResponse.json({
      success: true,
      message: 'Assignment sent for review successfully',
      data: assignment
    });

  } catch (error) {
    console.error('Error sending assignment for review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
