// /app/api/equipment/[id]/route.js
 
import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import Equipment from '@/model/Equipment';
 
export async function DELETE(request, { params }) {
  await connectToDB();
 
  const equipmentId = params.id;
 
  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(equipmentId);
 
    if (!deletedEquipment) {
      return NextResponse.json(
        { success: false, message: 'Equipment not found' },
        { status: 404 }
      );
    }
 
    return NextResponse.json({
      success: true,
      message: 'Equipment deleted successfully',
      data: deletedEquipment,
    });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
 