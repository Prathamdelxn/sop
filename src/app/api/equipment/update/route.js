import  connectDB  from '@/utils/db';
import Equipment from '@/model/Equipment';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    await connectDB();

    const { equipmentIds, ...updateData } = await req.json();
    console.log(equipmentIds);

    if (!equipmentIds) {
      return NextResponse.json(
        { success: false, message: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    // Find the equipment and update it
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentIds,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedEquipment) {
      return NextResponse.json(
        { success: false, message: 'Equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedEquipment, message: 'Equipment updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}