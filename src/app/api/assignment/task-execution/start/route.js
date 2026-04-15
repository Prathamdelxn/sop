import connectDB from '@/utils/db';

import { NextResponse } from 'next/server';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { assignmentId, stageId, taskId, subtaskId, startedBy, companyId } = body;

    if (!assignmentId || !stageId || !taskId || !startedBy || !companyId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (including companyId)' },
        { status: 400 }
      );
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

    // Fetch assignment
    const assignment = await AssignmentModel.findById(assignmentId);
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
    // If status is "Under Execution" and it's NOT the same user
    if (itemToUpdate.status === 'Under Execution' && (itemToUpdate.lockedBy?.id || itemToUpdate.startedBy?.id) !== startedBy.id) {
      return NextResponse.json({
        success: false,
        message: `Task is already being executed by ${itemToUpdate.lockedBy?.name || itemToUpdate.startedBy?.name || 'another worker'}.`,
        currentExecutor: itemToUpdate.lockedBy || itemToUpdate.startedBy
      }, { status: 409 });
    }

    // If status is "Paused", user must resume instead
    if (itemToUpdate.status === 'Paused') {
      return NextResponse.json({
        success: false,
        message: 'Task is paused. Please use the Resume option.',
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
    const now = new Date().toISOString();
    itemToUpdate.status = 'Under Execution';
    itemToUpdate.lockedBy = startedBy;
    itemToUpdate.startedBy = startedBy;
    itemToUpdate.startedAt = now;

    // Initialize sessions array if it doesn't exist
    if (!itemToUpdate.sessions) {
      itemToUpdate.sessions = [];
    }

    // IMPORTANT: DO NOT create a session here
    // The session will be created when the task is paused or completed
    // This prevents empty sessions or duplicate entries

    if (itemToUpdate.totalActiveSeconds === undefined) {
      itemToUpdate.totalActiveSeconds = 0;
    }

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
