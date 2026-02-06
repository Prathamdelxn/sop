import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Equipment from '@/model/Equipment';

export async function GET() {
  try {
    await dbConnect();

    const equipmentList = await Equipment.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: equipmentList }, { status: 200 });
  } catch (err) {
    console.error('Error fetching equipment:', err);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
