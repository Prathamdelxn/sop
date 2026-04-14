import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getTenantModel } from '@/utils/tenantDb';
import dbConnect from '@/utils/db';

export async function POST(req) {
    try {
        await dbConnect();
        const { barcode, userId, companyId } = await req.json();

        if (!barcode || !userId || !companyId) {
            return NextResponse.json({ error: 'Barcode, User ID, and Company ID are required' }, { status: 400 });
        }

        const EquipmentModel = getTenantModel("Equipment", companyId);
        const AssignmentModel = getTenantModel("NewAssignment", companyId);

        // 1. Find equipment by barcode OR by _id if barcode matches an ID format
        let equipment = await EquipmentModel.findOne({ barcode, companyId });

        if (!equipment && mongoose.isValidObjectId(barcode)) {
            equipment = await EquipmentModel.findOne({ _id: barcode, companyId });
        }

        if (!equipment) {
            return NextResponse.json({ error: `Equipment not found with barcode/ID: ${barcode}` }, { status: 404 });
        }

        // 2. Find matching task/assignment for this equipment and worker
        const activeAssignment = await AssignmentModel.findOne({
            companyId,
            status: { $ne: 'Completed' },
            $and: [
                {
                    $or: [
                        { 'equipment._id': equipment._id },
                        { 'equipment._id': equipment._id.toString() }
                    ]
                },
                {
                    $or: [
                        { "prototypeData.stages.assignedWorker.id": userId },
                        { "prototypeData.stages.tasks.assignedWorker.id": userId },
                        { "prototypeData.stages.tasks.subtasks.assignedWorker.id": userId },
                    ]
                }
            ]
        });

        if (!activeAssignment) {
            // Check if there is an assignment with status 'Completed'
            const completedAssignment = await AssignmentModel.findOne({
                companyId,
                status: 'Completed',
                $and: [
                    {
                        $or: [
                            { 'equipment._id': equipment._id },
                            { 'equipment._id': equipment._id.toString() }
                        ]
                    },
                    {
                        $or: [
                            { "prototypeData.stages.assignedWorker.id": userId },
                            { "prototypeData.stages.tasks.assignedWorker.id": userId },
                            { "prototypeData.stages.tasks.subtasks.assignedWorker.id": userId },
                        ]
                    }
                ]
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
            generatedId: activeAssignment.generatedId,
            prototypeName: activeAssignment.prototypeData?.name,
            status: activeAssignment.status
        });

    } catch (error) {
        console.error('Barcode Scan API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
