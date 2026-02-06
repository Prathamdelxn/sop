// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Equipment from '@/model/Equipment';

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();

//     const {
//       name,
//       type,
//       manufacturer,
//       supplier,
//       model,
//       serial,
//       assetTag,
//       companyId,
//       userId,
//     } = body;

//     // Optional: Validate required fields
//     if (!name || !type) {
//       return NextResponse.json(
//         { success: false, message: 'Name, ID, and Type are required' },
//         { status: 400 }
//       );
//     }

//     // Create equipment
//     const newEquipment = await Equipment.create({
//       name,
//       type,
//       manufacturer,
//       supplier,
//       model,
//       serial,
//       assetTag,
//        companyId,
//       userId,
//     });

//     return NextResponse.json({ success: true, data: newEquipment }, { status: 201 });

//   } catch (error) {
//     console.error('Create Equipment Error:', error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }
//src/app/api/equipment/create/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Equipment from '@/model/Equipment';

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

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: 'Name and Type are required' },
        { status: 400 }
      );
    }

    // Validate unique assetTag if provided
    

    // Create equipment
    const newEquipment = await Equipment.create({
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

    return NextResponse.json({ success: true, data: newEquipment }, { status: 201 });

  } catch (error) {
    console.error('Create Equipment Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}