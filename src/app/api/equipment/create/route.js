import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      type,
      manufacturer,
      supplier,
      model,
      serial,
      preventiveMaintenaceDoneDate,
      qmsNumber,
      preventiveDueDate,
      qualificationDoneDate,
      qualificationDueDate,
      equipmentId,
      companyId,
      userId,
      barcode,
      status,
      rejectionReason,
      assignedPrototype
    } = body;

    if (!companyId) {
      return NextResponse.json({ success: false, message: "Company ID is required for data isolation" }, { status: 400 });
    }

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: 'Name and Type are required' },
        { status: 400 }
      );
    }

    const EquipmentModel = EquipmentStatic; 
    const __tenantCompanyId = companyId;

    // Create equipment in company collection
    const newEquipment = await EquipmentModel.create({
      name,
      type,
      manufacturer,
      supplier,
      model,
      serial,
      preventiveMaintenaceDoneDate,
      qmsNumber,
      preventiveDueDate,
      qualificationDoneDate: qualificationDoneDate || null,
      qualificationDueDate: qualificationDueDate || null,
      equipmentId,
      companyId,
      userId,
      barcode: barcode || '',
      status: status || 'InProgress',
      rejectionReason,
      assignedPrototype,
    });

    if (newEquipment && newEquipment._id) {
       await CompanyStatic.findOneAndUpdate(
           { companyId },
           { $push: { equipments: newEquipment._id } }
       );
    }

    return NextResponse.json({ success: true, data: newEquipment }, { status: 201 });

  } catch (error) {
    console.error('Create Equipment Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}