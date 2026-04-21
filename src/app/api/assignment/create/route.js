import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { generatedId, equipment, prototype, companyId, userId } = body;

    // Validation
    if (!companyId) {
      return NextResponse.json({ success: false, message: "Company ID is required for data isolation" }, { status: 400 });
    }

    if (!generatedId || !equipment || !prototype) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (generatedId, equipment, or prototype)' },
        { status: 400 }
      );
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;

    const newAssignment = await AssignmentModel.create({
      generatedId,
      equipment,
      prototypeData: prototype,
      companyId,
      userId
    });

    if (newAssignment && newAssignment._id) {
       await CompanyStatic.findOneAndUpdate(
           { companyId },
           { $push: { assignments: newAssignment._id } }
       );
    }

    return NextResponse.json({
      success: true,
      message: 'Assignment created successfully in tenant storage',
      data: newAssignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
