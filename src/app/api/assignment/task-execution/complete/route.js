import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { assignmentId, stageId, taskId, subtaskId, executionData } = body;

    if (!assignmentId || !stageId || !taskId || !executionData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { 
      completedBy, 
      completedAt, 
      actualDuration, 
      elapsedTime,
      reason, 
      status,
      minTime,
      maxTime
    } = executionData;

    // Backend validation for mandatory reason
    const convertToSeconds = (duration) => {
      if (!duration || duration === "N/A" || duration === "") return null;
      if (typeof duration === "string" && duration.includes(":")) {
        const parts = duration.split(":").map(Number);
        const [h = 0, m = 0, s = 0] = parts;
        return h * 3600 + m * 60 + s;
      }
      if (typeof duration === "object") {
        const { hours = 0, minutes = 0, seconds = 0 } = duration;
        return hours * 3600 + minutes * 60 + seconds;
      }
      if (typeof duration === "number") return duration * 60;
      return null;
    };

    const minSeconds = convertToSeconds(minTime);
    const maxSeconds = convertToSeconds(maxTime);

    const needsReason = (minSeconds !== null && elapsedTime < minSeconds) || 
                        (maxSeconds !== null && elapsedTime > maxSeconds);

    if (needsReason && (!reason || !reason.text || reason.text.trim() === "")) {
      return NextResponse.json(
        { success: false, message: 'Reason is mandatory for early or late completion' },
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

    // Find the stage and task to update
    let taskFound = false;
    if (assignment.prototypeData && assignment.prototypeData.stages) {
      for (let stage of assignment.prototypeData.stages) {
        if (stage._id?.toString() === stageId || stage.stageId === stageId) {
          for (let task of stage.tasks) {
            if (task._id?.toString() === taskId || task.taskId === taskId) {
              if (subtaskId) {
                // Update subtask within task
                let subtaskFound = false;
                if (task.subtasks) {
                  for (let subtask of task.subtasks) {
                    if (subtask._id?.toString() === subtaskId || subtask.subtaskId === subtaskId) {
                      subtask.status = status || 'completed';
                      subtask.completedBy = completedBy;
                      subtask.completedAt = completedAt;
                      subtask.actualDuration = actualDuration;
                      subtask.elapsedTime = elapsedTime;
                      subtask.reason = reason;
                      subtaskFound = true;
                      taskFound = true;
                      break;
                    }
                  }
                }
                if (!subtaskFound) {
                  return NextResponse.json(
                    { success: false, message: 'Subtask not found in this task' },
                    { status: 404 }
                  );
                }
              } else {
                // Update main task execution details
                task.status = status || 'completed';
                task.completedBy = completedBy;
                task.completedAt = completedAt;
                task.actualDuration = actualDuration;
                task.elapsedTime = elapsedTime;
                task.reason = reason;
                taskFound = true;
              }
              break;
            }
          }
        }
        if (taskFound) break;
      }
    }

    if (!taskFound) {
      return NextResponse.json(
        { success: false, message: 'Task or Stage not found in this assignment' },
        { status: 404 }
      );
    }

    // Mark as modified if prototypeData is a plain Object
    assignment.markModified('prototypeData.stages');
    await assignment.save();

    return NextResponse.json({
      success: true,
      message: 'Task completion recorded successfully',
      data: assignment
    });

  } catch (error) {
    console.error('Error recording task completion:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
