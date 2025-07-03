import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Operator from '@/model/Operator'; // Ensure the path is correct

export async function GET() {
  await dbConnect();

  try {
    const operators = await Operator.find().select('-password'); // Exclude password

    return NextResponse.json({
      message: 'Operators fetched successfully',
      operators, // Return the array of operators
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch Operators Error:', error);
    return NextResponse.json({
      message: 'Failed to fetch operators',
    }, { status: 500 });
  }
}
