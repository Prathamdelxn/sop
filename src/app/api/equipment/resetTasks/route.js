import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import NewAssignment from '@/model/NewAssignment';

export async function POST(req) {
  try {
    await connectDB();
    const { equipmentId } = await req.json();

    if (!equipmentId) {
      return NextResponse.json({ success: false, message: 'Equipment ID is required' }, { status: 400 });
    }

    // Find all assignments associated with this equipment
    // Since equipment is stored as an object, we check equipment._id
    const assignments = await NewAssignment.find({ 'equipment._id': equipmentId });

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ success: false, message: 'No assignments found for this equipment' }, { status: 404 });
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
            }));
          }

          return resetTask;
        });

        return { ...stage, tasks: updatedTasks };
      });

      return { ...data, stages: updatedStages };
    };

    // Update each assignment
    const updatePromises = assignments.map(assignment => {
      const updatedPrototypeData = resetPrototypeData(assignment.prototypeData);
      
      return NewAssignment.findByIdAndUpdate(assignment._id, {
        $set: {
          status: 'InProgress',
          reviewStatus: null,
          reviewNotes: [],
          reviewedBy: null,
          reviewedAt: null,
          visualReviewStatus: null,
          visualReviewNotes: [],
          rejectionReason: "",
          prototypeData: updatedPrototypeData
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'All tasks and assignments for the equipment have been reset to initial stage.'
    });

  } catch (error) {
    console.error('Error resetting equipment tasks:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, { status: 500 });
  }
}
