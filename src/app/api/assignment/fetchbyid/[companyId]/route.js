import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json({ message: 'companyId is required' }, { status: 400 });
    }

    const AssignmentModel = AssignmentStatic; 
    const __tenantCompanyId = companyId;
    const assignments = await AssignmentModel.find({ companyId: __tenantCompanyId });
    
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
