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
    const { assignmentId, recordId, field, value, reviewerId, reviewerName, companyId } = await request.json();

    if (!assignmentId || recordId === undefined || !field || value === undefined || !companyId) {
      return NextResponse.json({ success: false, message: 'Missing fields (including companyId)' }, { status: 400 });
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ success: false, message: 'Assignment not found' }, { status: 404 });
    }

    const visualRep = assignment.prototypeData?.visualRepresntation;
    if (!visualRep || !visualRep[recordId]) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    // field: "production" or "qa"
    visualRep[recordId][field] = value;

    // Also track who did it
    if (!visualRep[recordId].completedBy) visualRep[recordId].completedBy = {};
    visualRep[recordId].completedBy[field] = {
      id: reviewerId,
      name: reviewerName,
      at: new Date()
    };

    assignment.markModified('prototypeData.visualRepresntation');
    await assignment.save();

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error updating checkpoint:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

