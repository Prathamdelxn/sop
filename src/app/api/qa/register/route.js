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

    // ✅ Check for duplicate email across all roles
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

    // ✅ Create new QA user
    const newQA = await QA.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: 'QA',
      status: 'active',
    });

    return NextResponse.json({
      message: 'QA registered successfully',
      qa: {
        id: newQA._id,
        name: newQA.name,
        email: newQA.email,
        phone: newQA.phone,
        location: newQA.location,
        role: newQA.role,
        status: newQA.status,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('QA Register API Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
