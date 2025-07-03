import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FacilityAdmin from '@/model/FacilityAdmin';

export async function GET() {
  await dbConnect();

  try {
    const admins = await FacilityAdmin.find().sort({ createdAt: -1 });

    return NextResponse.json({
      message: 'Facility Admins fetched successfully',
      facilityAdmins: admins.map(admin => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
      }))
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch Facility Admins Error:', error);
    return NextResponse.json({ message: 'Server error while fetching admins' }, { status: 500 });
  }
}
