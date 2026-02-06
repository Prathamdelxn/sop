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
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // ✅ Check if email exists in any other role-based collection
    const models = [Admin, FacilityAdmin, UserFacilityAdmin, Supervisor, Operator, QA];

    for (const model of models) {
      const existingUser = await model.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'Email already registered in another role' }, { status: 409 });
      }
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the Supervisor
    const newSupervisor = await Supervisor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: 'supervisor',
      status: 'active',
    });

    return NextResponse.json({
      message: 'Supervisor registered successfully',
      supervisor: {
        id: newSupervisor._id,
        name: newSupervisor.name,
        email: newSupervisor.email,
        role: newSupervisor.role,
        status: newSupervisor.status,
        phone: newSupervisor.phone,
        location: newSupervisor.location,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Supervisor Register API Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
