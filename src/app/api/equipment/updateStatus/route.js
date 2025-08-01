// import { NextResponse } from 'next/server';
// import Equipment from '@/model/Equipment';
// import connectToDB from '@/utils/db';

// export async function PUT(request) {
//   await connectToDB();

//   const { equipmentId, status } = await request.json();

//   try {
//     const updatedEquipment = await Equipment.findByIdAndUpdate(
//       equipmentId,
//       { status },
//       { new: true }
//     );

//     if (!updatedEquipment) {
//       return NextResponse.json(
//         { error: 'Equipment not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedEquipment);
//   } catch (error) {
//     console.error('Error updating equipment status:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import Equipment from '@/model/Equipment';
import connectToDB from '@/utils/db';

export async function PUT(request) {
  await connectToDB();

  try {
    const { equipmentId, status, reason } = await request.json();

    if (!equipmentId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: equipmentId or status' },
        { status: 400 }
      );
    }

    const updateFields = { status };
    if (status === 'rejected' && reason) {
      updateFields.reason = reason;
    } else if (status === 'approved' || status === 'pending') {
      updateFields.reason = ''; // Clear previous reason if status is changed
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      updateFields,
      { new: true }
    );

    if (!updatedEquipment) {
      return NextResponse.json(
        { success: false, message: 'Equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Equipment status updated to '${status}'`,
      data: updatedEquipment
    });

  } catch (error) {
    console.error('Error updating equipment status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
