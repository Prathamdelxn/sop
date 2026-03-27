import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { assignmentId, stageId, taskId, subtaskId, pausedBy } = body;

    if (!assignmentId || !stageId || !taskId || !pausedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
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

    // Only current lock holder can pause
    if (itemToUpdate.status !== 'Under Execution' || itemToUpdate.lockedBy?.id !== pausedBy.id) {
      return NextResponse.json({
        success: false,
        message: 'You do not have the active lock on this task.',
      }, { status: 403 });
    }

    const now = new Date().toISOString();
    const startedAt = new Date(itemToUpdate.startedAt).getTime();
    const endedAt = new Date(now).getTime();
    const durationSeconds = Math.max(0, Math.floor((endedAt - startedAt) / 1000));

    // Initialize tracking fields if they don't exist (plain objects)
    if (!itemToUpdate.sessions) itemToUpdate.sessions = [];
    if (itemToUpdate.totalActiveSeconds === undefined) itemToUpdate.totalActiveSeconds = 0;

    // Record session - this creates one session per work period
    itemToUpdate.sessions.push({
      workerId: pausedBy.id,
      workerName: pausedBy.name,
      startedAt: itemToUpdate.startedAt,
      endedAt: now,
      durationSeconds: durationSeconds
    });

    itemToUpdate.totalActiveSeconds += durationSeconds;
    itemToUpdate.status = 'Paused';
    itemToUpdate.lockedBy = null;
    itemToUpdate.lastWorker = { id: pausedBy.id, name: pausedBy.name };
    itemToUpdate.pausedAt = now;
    itemToUpdate.startedAt = null; // Clear startedAt after recording session

    assignment.markModified('prototypeData.stages');
    await assignment.save();

    return NextResponse.json({
      success: true,
      message: 'Task paused successfully',
      data: {
        status: itemToUpdate.status,
        totalActiveSeconds: itemToUpdate.totalActiveSeconds,
        sessions: itemToUpdate.sessions,
        lastWorker: itemToUpdate.lastWorker
      }
    });

  } catch (error) {
    console.error('Error pausing task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}