import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Equipment from '@/model/Equipment';
import NewAssignment from '@/model/NewAssignment';
import dbConnect from '@/utils/db';

export async function POST(req) {
    try {
        await dbConnect();
        const { barcode, userId, companyId } = await req.json();

        if (!barcode || !userId || !companyId) {
            return NextResponse.json({ error: 'Barcode, User ID, and Company ID are required' }, { status: 400 });
        }

        // 1. Find equipment by barcode OR by _id if barcode matches an ID format
        let equipment = await Equipment.findOne({ barcode, companyId });

        if (!equipment && mongoose.isValidObjectId(barcode)) {
            equipment = await Equipment.findOne({ _id: barcode, companyId });
        }

        if (!equipment) {
            return NextResponse.json({ error: `Equipment not found with barcode/ID: ${barcode}` }, { status: 404 });
        }

        // 2. Find matching task/assignment for this equipment and worker
        // We match assignments where the equipment reference contains this equipment's ID
        // And the worker is assigned at any level (stage, task, or subtask).
        const activeAssignment = await NewAssignment.findOne({
            'equipment._id': equipment._id,
            companyId,
            status: { $ne: 'Completed' },
            $or: [
                { "prototypeData.stages.assignedWorker.id": userId },
                { "prototypeData.stages.tasks.assignedWorker.id": userId },
                { "prototypeData.stages.tasks.subtasks.assignedWorker.id": userId },
            ],
        });

        if (!activeAssignment) {
            // Check if there is an assignment with status 'Completed'
            const completedAssignment = await NewAssignment.findOne({
                'equipment._id': equipment._id,
                companyId,
                status: 'Completed',
                $or: [
                    { "prototypeData.stages.assignedWorker.id": userId },
                    { "prototypeData.stages.tasks.assignedWorker.id": userId },
                    { "prototypeData.stages.tasks.subtasks.assignedWorker.id": userId },
                ],
            });

            if (completedAssignment) {
                return NextResponse.json({
                    message: 'This equipment has a completed assignment',
                    assignmentId: completedAssignment._id,
                    status: 'Completed'
                });
            }

            return NextResponse.json({
                error: 'No active task found for this equipment assigned to you',
                equipmentName: equipment.name
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Assignment found',
            assignmentId: activeAssignment._id,
            status: activeAssignment.status
        });

    } catch (error) {
        console.error('Barcode Scan API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
