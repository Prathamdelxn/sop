import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import QA from '@/model/QA';

export async function GET() {
  await dbConnect();

  try {
    const qaUsers = await QA.find().select('-password'); // ❌ Exclude password for security

    return NextResponse.json(
      { message: 'QA users fetched successfully', data: qaUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching QA users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch QA users' },
      { status: 500 }
    );
  }
}
