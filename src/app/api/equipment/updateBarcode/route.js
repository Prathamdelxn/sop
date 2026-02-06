import { NextResponse } from 'next/server';
import Equipment from '@/model/Equipment';
import connectToDB from '@/utils/db';

export async function PUT(request) {
  await connectToDB();

  try {
    const { equipmentId, barcodeUrl } = await request.json();

   

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      { barcode: barcodeUrl },
      { new: true }
    );

    if (!updatedEquipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEquipment);
  } catch (error) {
    console.error('Error updating barcode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}