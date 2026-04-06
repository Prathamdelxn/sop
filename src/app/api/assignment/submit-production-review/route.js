import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';
import { NextResponse } from 'next/server';

/**
 * Visual Reviewer / Production Manager review endpoint.
 * 
 * Actions:
 *   "approve"  — marks the assignment as Completed (all checkpoints are Clean)
 *   "reopen"   — reopens selected tasks and sends them back to the Worker
 *                (they must go through Reviewer again before returning here)
 * 
 * Body shape:
 * {
 *   assignmentId: string,
 *   reviewerId: string,
 *   reviewerName: string,
 *   action: "approve" | "reopen",
 *   note?: string,                  // single note for all reopened tasks
 *   reopenItems?: [{                // only for "reopen"
 *     stageIndex: number,
 *     taskIndex: number,
 *     subtaskIndex?: number,
 *     taskTitle: string,
 *     taskPath?: string,
 *     assignedWorker?: [{ id, name }]
 *   }],
 *   checkpointResults?: [{          // visual inspection results
 *     checkpointIndex: number,
 *     status: "Clean" | "Not Clean"
 *   }]
 * }
 */
export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      assignmentId,
      reviewerId,
      reviewerName,
      action,
      note,
      reopenItems,
      checkpointResults
    } = body;

    if (!assignmentId || !reviewerId || !reviewerName || !action) {
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

    // ── APPROVE ──────────────────────────────────────────────────────────
    if (action === 'approve') {
      assignment.status = 'Completed';
      assignment.visualReviewStatus = 'Approved';
      assignment.visualReviewNotes = [{
        taskPath: 'visual-review',
        taskTitle: 'Visual Inspection',
        note: note || 'All checkpoints approved as Clean',
        reviewedBy: { id: reviewerId, name: reviewerName },
        reviewedAt: new Date()
      }];

      assignment.markModified('prototypeData');
      await assignment.save();

      return NextResponse.json({
        success: true,
        message: 'Visual review approved — assignment completed',
        data: assignment
      });
    }

    // ── REOPEN ───────────────────────────────────────────────────────────
    if (action === 'reopen') {
      if (!reopenItems || reopenItems.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No tasks selected for reopening' },
          { status: 400 }
        );
      }

      const stages = assignment.prototypeData?.stages;
      if (!stages) {
        return NextResponse.json(
          { success: false, message: 'No stages found in assignment' },
          { status: 400 }
        );
      }

      // Use a single note for all reopened tasks
      const sharedNote = note || '';
      const visualReviewNotes = [];

      for (const item of reopenItems) {
        const { stageIndex, taskIndex, subtaskIndex, taskTitle, taskPath, assignedWorker } = item;

        if (stageIndex === undefined || taskIndex === undefined) continue;

        const stage = stages[stageIndex];
        if (!stage || !stage.tasks) continue;

        if (subtaskIndex !== undefined && subtaskIndex !== null) {
          // Reopen a subtask
          const task = stage.tasks[taskIndex];
          if (task && task.subtasks && task.subtasks[subtaskIndex]) {
            const subtask = task.subtasks[subtaskIndex];
            subtask.status = 'pending';
            subtask.completedBy = null;
            subtask.completedAt = null;
            subtask.lockedBy = null;
            subtask.startedBy = null;
            subtask.startedAt = null;
            subtask.actualDuration = null;
            subtask.elapsedTime = null;
            subtask.totalActiveSeconds = null;
            subtask.reason = null;
            if (assignedWorker && Array.isArray(assignedWorker)) {
              if (!subtask.assignedWorker) subtask.assignedWorker = [];
              assignedWorker.forEach(newWorker => {
                const alreadyAssigned = subtask.assignedWorker.some(
                  w => (w.id || w._id) === (newWorker.id || newWorker._id)
                );
                if (!alreadyAssigned) subtask.assignedWorker.push(newWorker);
              });
            }
          }
        } else {
          // Reopen a main task and all its subtasks
          const task = stage.tasks[taskIndex];
          if (task) {
            task.status = 'pending';
            task.completedBy = null;
            task.completedAt = null;
            task.lockedBy = null;
            task.startedBy = null;
            task.startedAt = null;
            task.actualDuration = null;
            task.elapsedTime = null;
            task.totalActiveSeconds = null;
            task.reason = null;
            if (assignedWorker && Array.isArray(assignedWorker)) {
              if (!task.assignedWorker) task.assignedWorker = [];
              assignedWorker.forEach(newWorker => {
                const alreadyAssigned = task.assignedWorker.some(
                  w => (w.id || w._id) === (newWorker.id || newWorker._id)
                );
                if (!alreadyAssigned) task.assignedWorker.push(newWorker);
              });
            }

            // Also reopen all subtasks
            if (task.subtasks && Array.isArray(task.subtasks)) {
              task.subtasks.forEach(subtask => {
                subtask.status = 'pending';
                subtask.completedBy = null;
                subtask.completedAt = null;
                subtask.lockedBy = null;
                subtask.startedBy = null;
                subtask.startedAt = null;
                subtask.actualDuration = null;
                subtask.elapsedTime = null;
                subtask.totalActiveSeconds = null;
                subtask.reason = null;
                if (assignedWorker && Array.isArray(assignedWorker)) {
                  if (!subtask.assignedWorker) subtask.assignedWorker = [];
                  assignedWorker.forEach(newWorker => {
                    const alreadyAssigned = subtask.assignedWorker.some(
                      w => (w.id || w._id) === (newWorker.id || newWorker._id)
                    );
                    if (!alreadyAssigned) subtask.assignedWorker.push(newWorker);
                  });
                }
              });
            }
          }
        }

        // Record visual review note with the shared note for each reopened item
        visualReviewNotes.push({
          taskPath: taskPath || `stages.${stageIndex}.tasks.${taskIndex}${subtaskIndex !== undefined && subtaskIndex !== null ? `.subtasks.${subtaskIndex}` : ''}`,
          taskTitle: taskTitle || 'Unknown Task',
          note: sharedNote,
          reviewedBy: { id: reviewerId, name: reviewerName },
          reviewedAt: new Date()
        });
      }

      // Set status back to InProgress so worker can redo, then go through reviewer again
      assignment.status = 'Rework Required';
      assignment.reviewStatus = 'Rework Required';
      assignment.visualReviewStatus = 'Not Clean';
      assignment.reviewedBy = null;
      assignment.reviewedAt = null;
      assignment.visualReviewNotes = visualReviewNotes;

      assignment.markModified('prototypeData.stages');
      assignment.markModified('visualReviewNotes');
      await assignment.save();

      return NextResponse.json({
        success: true,
        message: `${reopenItems.length} task(s) reopened by visual reviewer`,
        data: assignment
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action. Use "approve" or "reopen"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in production/visual review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
