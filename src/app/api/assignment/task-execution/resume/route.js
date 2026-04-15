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
    const { assignmentId, stageId, taskId, subtaskId, resumedBy, companyId } = body;

    if (!assignmentId || !stageId || !taskId || !resumedBy || !companyId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (including companyId)' },
        { status: 400 }
      );
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

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

    // Only paused tasks can be resumed
    if (itemToUpdate.status !== 'Paused') {
      return NextResponse.json({
        success: false,
        message: 'Task is not paused.',
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    itemToUpdate.status = 'Under Execution';
    itemToUpdate.lockedBy = resumedBy;
    itemToUpdate.startedAt = now; // Start new session at current time

    // IMPORTANT: DO NOT create a new session here
    // The session will be created when the task is paused or completed
    // This prevents duplicate sessions with the same start time

    assignment.markModified('prototypeData.stages');
    await assignment.save();

    return NextResponse.json({
      success: true,
      message: 'Task resumed successfully',
      data: {
        status: itemToUpdate.status,
        lockedBy: itemToUpdate.lockedBy,
        startedAt: itemToUpdate.startedAt
      }
    });

  } catch (error) {
    console.error('Error resuming task:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
