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
      assetTag,
      companyId,
      userId,
    } = body;

    // Optional: Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: 'Name, ID, and Type are required' },
        { status: 400 }
      );
    }

    // Create equipment
    const newEquipment = await Equipment.create({
      name,
      type,
      manufacturer,
      supplier,
      model,
      serial,
      assetTag,
       companyId,
      userId,
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
