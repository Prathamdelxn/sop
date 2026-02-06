import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/db';

// Import all role-based models
import Admin from '@/model/Admin';
import FacilityAdmin from '@/model/FacilityAdmin';
import UserFacilityAdmin from '@/model/UserFacilityAdmin';
import Supervisor from '@/model/Supervisor';
import Operator from '@/model/Operator';
import QA from '@/model/QA';

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password, phone, location } = await req.json();

    // ✅ Validate input
    if (!name || !email || !password || !phone || !location) {
      return NextResponse.json(
        { message: 'All fields are required (name, email, password, phone, location)' },
        { status: 400 }
      );
    }

    // ✅ Check across all models if email already exists
    const models = [Admin, FacilityAdmin, UserFacilityAdmin, Supervisor, Operator, QA];

    for (const model of models) {
      const existing = await model.findOne({ email });
      if (existing) {
        return NextResponse.json(
          { message: `Email already registered in another role` },
          { status: 409 }
        );
      }
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new Facility Admin
    const facilityAdmin = await FacilityAdmin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: 'facility-admin',
      status: 'active',
    });

    // ✅ Respond
    return NextResponse.json(
      {
        message: 'Facility Admin registered successfully',
        facilityAdmin: {
          id: facilityAdmin._id,
          name: facilityAdmin.name,
          email: facilityAdmin.email,
          phone: facilityAdmin.phone,
          location: facilityAdmin.location,
          role: facilityAdmin.role,
          status: facilityAdmin.status,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Facility Admin Register API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
