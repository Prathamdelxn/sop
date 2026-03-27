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

                      // CHECK IF THE LAST SESSION IS ALREADY RECORDED
                      // We only want to record a final session if the task is currently active
                      const isCurrentlyActive = subtask.status === 'Under Execution';

                      if (isCurrentlyActive && subtask.startedAt) {
                        // LOG FINAL SESSION BEFORE COMPLETING
                        const now = new Date().toISOString();
                        const startedAt = new Date(subtask.startedAt).getTime();
                        const endedAt = new Date(now).getTime();
                        const sessionDuration = Math.max(0, Math.floor((endedAt - startedAt) / 1000));

                        if (!subtask.sessions) subtask.sessions = [];
                        if (subtask.totalActiveSeconds === undefined) subtask.totalActiveSeconds = 0;

                        // Check if we already have an open session (last session without endedAt)
                        const lastSession = subtask.sessions[subtask.sessions.length - 1];
                        const hasOpenSession = lastSession && !lastSession.endedAt;

                        if (hasOpenSession) {
                          // Update the open session instead of creating a new one
                          lastSession.endedAt = now;
                          lastSession.durationSeconds = sessionDuration;
                          subtask.totalActiveSeconds = (subtask.totalActiveSeconds - lastSession.durationSeconds) + sessionDuration;
                        } else {
                          // Create new session
                          subtask.sessions.push({
                            workerId: completedBy.id,
                            workerName: completedBy.name,
                            startedAt: subtask.startedAt,
                            endedAt: now,
                            durationSeconds: sessionDuration
                          });
                          subtask.totalActiveSeconds += sessionDuration;
                        }
                        subtask.startedAt = null; // Prevent overlapping if called again
                      }

                      subtask.status = status || 'completed';
                      subtask.completedBy = completedBy;
                      subtask.completedAt = completedAt;
                      subtask.actualDuration = actualDuration;
                      subtask.elapsedTime = subtask.totalActiveSeconds || elapsedTime;
                      subtask.reason = reason;
                      subtask.lockedBy = null; // Release lock
                      subtask.startedAt = null; // Clear startedAt for completed task
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
                // Update main task

                // CHECK IF THE LAST SESSION IS ALREADY RECORDED
                const isCurrentlyActive = task.status === 'Under Execution';

                if (isCurrentlyActive && task.startedAt) {
                  // LOG FINAL SESSION BEFORE COMPLETING
                  const now = new Date().toISOString();
                  const startedAt = new Date(task.startedAt).getTime();
                  const endedAt = new Date(now).getTime();
                  const sessionDuration = Math.max(0, Math.floor((endedAt - startedAt) / 1000));

                  if (!task.sessions) task.sessions = [];
                  if (task.totalActiveSeconds === undefined) task.totalActiveSeconds = 0;

                  // Check if we already have an open session (last session without endedAt)
                  const lastSession = task.sessions[task.sessions.length - 1];
                  const hasOpenSession = lastSession && !lastSession.endedAt;

                  if (hasOpenSession) {
                    // Update the open session instead of creating a new one
                    lastSession.endedAt = now;
                    lastSession.durationSeconds = sessionDuration;
                    task.totalActiveSeconds = (task.totalActiveSeconds - lastSession.durationSeconds) + sessionDuration;
                  } else {
                    // Create new session
                    task.sessions.push({
                      workerId: completedBy.id,
                      workerName: completedBy.name,
                      startedAt: task.startedAt,
                      endedAt: now,
                      durationSeconds: sessionDuration
                    });
                    task.totalActiveSeconds += sessionDuration;
                  }
                  task.startedAt = null; // Prevent overlapping if called again
                }

                // Update main task execution details
                task.status = status || 'completed';
                task.completedBy = completedBy;
                task.completedAt = completedAt;
                task.actualDuration = actualDuration;
                task.elapsedTime = task.totalActiveSeconds || elapsedTime;
                task.reason = reason;
                task.lockedBy = null; // Release lock on completion
                task.startedAt = null; // Clear startedAt for completed task
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