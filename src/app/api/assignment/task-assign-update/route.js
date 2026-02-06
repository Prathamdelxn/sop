import connectDB from '@/utils/db';
import Assignment from '@/model/NewAssignment';

export async function PUT(request) {
  try {
    await connectDB();

    const { assignmentId, status, stages } = await request.json();

    // Fetch the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return Response.json(
        { message: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Build a map of updates for quick lookup
    const stageUpdateMap = new Map(
      stages.map(stage => [
        stage.stageId,
        new Map(stage.tasks.map(task => [task.taskId, task.assignedWorker]))
      ])
    );

    // Directly mutate the original mongoose subdocuments
    assignment.prototypeData.stages.forEach(stage => {
      const stageId = stage._id.toString();
      const taskUpdates = stageUpdateMap.get(stageId);

      if (!taskUpdates) return;

      stage.tasks.forEach(task => {
        const taskId = task._id.toString();
        const assignedWorker = taskUpdates.get(taskId);
        if (assignedWorker) {
          task.assignedWorker = assignedWorker; // Mutating directly
        }
      });
    });

    // Update other fields
    assignment.status = status;
    assignment.assignedAt = new Date();

    // Optional: ensure Mongoose picks up nested changes
    assignment.markModified('prototypeData.stages');

    // Save changes
    const updatedAssignment = await assignment.save();

    return Response.json(
      {
        success: true,
        message: 'Assignment updated successfully',
        updatedAssignment: updatedAssignment.toObject()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating assignment:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to update assignment',
        error: error.message
      },
      { status: 500 }
    );
  }
}
