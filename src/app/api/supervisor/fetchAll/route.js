import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Supervisor from '@/model/Supervisor';

export async function GET() {
  try {
    await dbConnect();

    const supervisors = await Supervisor.find({}, '-password'); // exclude password
    return NextResponse.json({ success: true, supervisors });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch supervisors.' },
      { status: 500 }
    );
  }
}
