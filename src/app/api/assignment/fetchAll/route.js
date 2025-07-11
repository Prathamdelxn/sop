import { NextResponse } from 'next/server';
import connectDB from '@/utils/db'; // your MongoDB connection utility
import NewAssignment from '@/model/NewAssignment'; // adjust if the path is different

export async function GET() {
  await connectDB();

  try {
    const assignments = await NewAssignment.find().sort({ assignedAt: -1 }); // newest first
    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch assignments',
    }, { status: 500 });
  }
}
