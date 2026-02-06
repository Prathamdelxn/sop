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
        { message: 'All fields (name, email, password, phone, location) are required' },
        { status: 400 }
      );
    }

    // ✅ Check if email exists in any role-based collection
    const models = [Admin, FacilityAdmin, UserFacilityAdmin, Supervisor, Operator, QA];

    for (const model of models) {
      const existing = await model.findOne({ email });
      if (existing) {
        return NextResponse.json(
          { message: 'Email already registered in another role' },
          { status: 409 }
        );
      }
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new User Facility Admin
    const newUserFA = await UserFacilityAdmin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: 'user-facility-admin',
      status: 'active',
    });

    return NextResponse.json({
      message: 'User Facility Admin registered successfully',
      userFacilityAdmin: {
        id: newUserFA._id,
        name: newUserFA.name,
        email: newUserFA.email,
        phone: newUserFA.phone,
        location: newUserFA.location,
        role: newUserFA.role,
        status: newUserFA.status,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('User Facility Admin Register API Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
