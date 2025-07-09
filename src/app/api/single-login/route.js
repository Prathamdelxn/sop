// /app/api/auth/login/route.js

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

const roleModels = [
  { role: 'admin', model: Admin },
  { role: 'facility-admin', model: FacilityAdmin },
  { role: 'user-facility-admin', model: UserFacilityAdmin },
  { role: 'supervisor', model: Supervisor },
  { role: 'operator', model: Operator },
  { role: 'QA', model: QA },
];

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // ✅ Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // ✅ Check each role model for this email
    let foundUser = null;
    let foundRole = null;

    for (const { role, model } of roleModels) {
      const user = await model.findOne({ email });
      if (user) {
        foundUser = user;
        foundRole = role;
        break;
      }
    }

    // ❌ Email not found in any role
    if (!foundUser) {
      return NextResponse.json({ message: 'User not found in any role' }, { status: 404 });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // ✅ Return user info and role
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundRole,
        phone: foundUser.phone || null,
        location: foundUser.location || null,
        status: foundUser.status || 'active',
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
