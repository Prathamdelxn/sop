import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


// ✅ Reset Equipment Tasks with Multi-Tenant Isolation
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { equipmentId, companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'companyId is required for multi-tenant isolation' },
        { status: 400 }
      );
    }

    if (!equipmentId) {
      return NextResponse.json(
        { success: false, message: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    // Get the dynamic NewAssignment model for this company
    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

    // Find all assignments associated with this equipment in the tenant-specific collection
    const assignments = await AssignmentModel.find({ 'equipment._id': equipmentId, companyId: __tenantCompanyId });

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No assignments found for this equipment in this company\'s collection' 
      }, { status: 404 });
    }

    // Helper function to reset duties in prototypeData
    const resetPrototypeData = (data) => {
      if (!data || !data.stages) return data;

      const updatedStages = data.stages.map(stage => {
        if (!stage.tasks) return stage;

        const updatedTasks = stage.tasks.map(task => {
          // Reset task fields
          const resetTask = {
            ...task,
            status: 'pending', // Reset status to pending
            completedBy: null,
            completedAt: null,
            totalActiveSeconds: 0,
            sessions: [],
            lockedBy: null,
            startedBy: null,
            startedAt: null,
            pausedAt: null,
            reason: null,
            actualDuration: null,
            elapsedTime: 0,
          };

          // Reset subtasks if any
          if (task.subtasks) {
            resetTask.subtasks = task.subtasks.map(subtask => ({
              ...subtask,
              status: 'pending',
              completedBy: null,
              completedAt: null,
              totalActiveSeconds: 0,
              sessions: [],
              reason: null,
              startedAt: null,
              pausedAt: null,
              startedBy: null,
              actualDuration: null,
              elapsedTime: 0,
            }));
          }

          return resetTask;
        });

        return { ...stage, tasks: updatedTasks };
      });

      return { ...data, stages: updatedStages };
    };

    // Update each assignment within the tenant-specific collection
    const updatePromises = assignments.map(assignment => {
      const updatedPrototypeData = resetPrototypeData(assignment.prototypeData);
      
      return AssignmentModel.findByIdAndUpdate(assignment._id, {
        $set: {
          status: 'InProgress',
          reviewStatus: null,
          reviewNotes: [],
          reviewedBy: null,
          reviewedAt: null,
          visualReviewStatus: null,
          visualReviewNotes: [],
          rejectionReason: "",
          prototypeData: updatedPrototypeData,
          assignedAt: new Date()
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'All tasks and assignments for the equipment have been reset to initial stage.'
    });

  } catch (error) {
    console.error('❌ Error resetting equipment tasks:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
      details: error.message
    }, { status: 500 });
  }
}

