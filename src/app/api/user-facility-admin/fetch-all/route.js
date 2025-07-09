import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import UserFacilityAdmin from '@/model/UserFacilityAdmin';

export async function GET() {
  await dbConnect();

  try {
    const users = await UserFacilityAdmin.find().select('-password'); // Remove password from result

    return NextResponse.json(
      { message: 'User Facility Admins fetched successfully', data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching User Facility Admins:', error);
    return NextResponse.json(
      { message: 'Failed to fetch User Facility Admins' },
      { status: 500 }
    );
  }
}
