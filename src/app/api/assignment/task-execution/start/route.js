import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { assignmentId, stageId, taskId, subtaskId, startedBy } = body;

    if (!assignmentId || !stageId || !taskId || !startedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch assignment
    const assignment = await NewAssignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { success: false, message: 'Assignment not found' },
        { status: 404 }
      );
    }

    let itemToUpdate = null;
    let taskFound = false;

    if (assignment.prototypeData && assignment.prototypeData.stages) {
      for (let stage of assignment.prototypeData.stages) {
        if (stage._id?.toString() === stageId || stage.stageId === stageId) {
          for (let task of stage.tasks) {
            if (task._id?.toString() === taskId || task.taskId === taskId) {
              if (subtaskId) {
                if (task.subtasks) {
                  for (let subtask of task.subtasks) {
                    if (subtask._id?.toString() === subtaskId || subtask.subtaskId === subtaskId) {
                      itemToUpdate = subtask;
                      taskFound = true;
                      break;
                    }
                  }
                }
              } else {
                itemToUpdate = task;
                taskFound = true;
              }
              break;
            }
          }
        }
        if (taskFound) break;
      }
    }

    if (!taskFound || !itemToUpdate) {
      return NextResponse.json(
        { success: false, message: 'Task or Stage not found' },
        { status: 404 }
      );
    }

    // CONCURRENCY CHECK:
    // If status is already "Under Execution" and it's NOT the same user
    if (itemToUpdate.status === 'Under Execution' && itemToUpdate.startedBy?.id !== startedBy.id) {
      return NextResponse.json({
        success: false,
        message: `Task is already being executed by ${itemToUpdate.startedBy?.name || 'another worker'}.`,
        currentExecutor: itemToUpdate.startedBy
      }, { status: 409 });
    }

    // If status is already "completed", don't allow starting again
    if (itemToUpdate.status === 'completed') {
        return NextResponse.json({
          success: false,
          message: 'Task is already completed.'
        }, { status: 400 });
      }

    // Update status and starter info
    itemToUpdate.status = 'Under Execution';
    itemToUpdate.startedBy = startedBy;
    itemToUpdate.startedAt = new Date().toISOString();

    // Also update top-level assignment status if it's not already completed
    if (assignment.status !== 'Completed') {
        assignment.status = 'Under Execution';
    }

    assignment.markModified('prototypeData.stages');
    assignment.markModified('status');
    await assignment.save();

    return NextResponse.json({
      success: true,
      message: 'Task started successfully',
      data: {
          status: itemToUpdate.status,
          startedBy: itemToUpdate.startedBy,
          startedAt: itemToUpdate.startedAt
      }
    });

  } catch (error) {
    console.error('Error starting task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
