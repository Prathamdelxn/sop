import connectDB from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { assignmentId, reviewerId, reviewerName, action, reviewItems, companyId } = body;
    // action: "approve" | "reopen"
    // reviewItems: [{ taskPath, taskTitle, note, stageIndex, taskIndex, subtaskIndex? }]

    if (!assignmentId || !reviewerId || !reviewerName || !action || !companyId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (including companyId)' },
        { status: 400 }
      );
    }

    const AssignmentModel = getTenantModel("NewAssignment", companyId);

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { success: false, message: 'Assignment not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Check if visual representation is enabled on this checklist
      const isVisualEnabled = assignment.prototypeData?.visualRepresentationEnabled === true;

      if (isVisualEnabled) {
        // Route to Visual Reviewer instead of completing
        assignment.status = 'Pending Visual Review';
        assignment.reviewStatus = 'Approved';
        assignment.visualReviewStatus = 'Pending Visual Review';
        assignment.reviewedBy = { id: reviewerId, name: reviewerName };
        assignment.reviewedAt = new Date();
        assignment.reviewNotes = [];
      } else {
        // Normal flow — complete the assignment
        assignment.status = 'Completed';
        assignment.reviewStatus = 'Approved';
        assignment.reviewedBy = { id: reviewerId, name: reviewerName };
        assignment.reviewedAt = new Date();
        assignment.reviewNotes = [];
      }

      assignment.markModified('prototypeData');
      await assignment.save();

      return NextResponse.json({
        success: true,
        message: isVisualEnabled
          ? 'Assignment approved — pending visual review'
          : 'Assignment approved successfully',
        data: assignment
      });
    }

    if (action === 'reopen') {
      // Reopen selected tasks
      if (!reviewItems || reviewItems.length === 0) {
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

      const reviewNotes = [];

      for (const item of reviewItems) {
        const { stageIndex, taskIndex, subtaskIndex, note, taskTitle, taskPath, assignedWorker } = item;

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
            subtask.totalActiveSeconds = null; // Reset timing for rework
            subtask.reason = null;
            // Add assigned worker if provided (append to existing)
            if (assignedWorker && Array.isArray(assignedWorker)) {
              if (!subtask.assignedWorker) subtask.assignedWorker = [];
              assignedWorker.forEach(newWorker => {
                const alreadyAssigned = subtask.assignedWorker.some(w => (w.id || w._id) === (newWorker.id || newWorker._id));
                if (!alreadyAssigned) {
                  subtask.assignedWorker.push(newWorker);
                }
              });
            }
            // Keep sessions and totalActiveSeconds for history
          }
        } else {
          // Reopen a main task
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
            task.totalActiveSeconds = null; // Reset timing for rework
            task.reason = null;
            // Add assigned worker if provided (append to existing)
            if (assignedWorker && Array.isArray(assignedWorker)) {
              if (!task.assignedWorker) task.assignedWorker = [];
              assignedWorker.forEach(newWorker => {
                const alreadyAssigned = task.assignedWorker.some(w => (w.id || w._id) === (newWorker.id || newWorker._id));
                if (!alreadyAssigned) {
                  task.assignedWorker.push(newWorker);
                }
              });
            }

            // ALSO reopen all subtasks
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
                subtask.totalActiveSeconds = null; // Reset timing for rework
                subtask.reason = null;
                
                // Add assigned worker if provided to all subtasks too
                if (assignedWorker && Array.isArray(assignedWorker)) {
                  if (!subtask.assignedWorker) subtask.assignedWorker = [];
                  assignedWorker.forEach(newWorker => {
                    const alreadyAssigned = subtask.assignedWorker.some(w => (w.id || w._id) === (newWorker.id || newWorker._id));
                    if (!alreadyAssigned) {
                      subtask.assignedWorker.push(newWorker);
                    }
                  });
                }
              });
            }
            // Keep sessions and totalActiveSeconds for history
          }
        }

        // Record review note
        reviewNotes.push({
          taskPath: taskPath || `stages.${stageIndex}.tasks.${taskIndex}${subtaskIndex !== undefined && subtaskIndex !== null ? `.subtasks.${subtaskIndex}` : ''}`,
          taskTitle: taskTitle || 'Unknown Task',
          note: note || '',
          reopened: true,
          reviewedBy: { id: reviewerId, name: reviewerName },
          reviewedAt: new Date()
        });
      }

      // Update assignment status
      assignment.status = 'Rework Required';
      assignment.reviewStatus = 'Rework Required';
      assignment.reviewedBy = { id: reviewerId, name: reviewerName };
      assignment.reviewedAt = new Date();
      assignment.reviewNotes = reviewNotes;

      assignment.markModified('prototypeData.stages');
      assignment.markModified('reviewNotes');
      await assignment.save();

      return NextResponse.json({
        success: true,
        message: `${reviewItems.length} task(s) reopened for rework`,
        data: assignment
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action. Use "approve" or "reopen"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
