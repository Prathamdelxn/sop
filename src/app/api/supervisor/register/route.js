import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Supervisor from '@/model/Supervisor'; // Adjust the import if path is different
import dbConnect from '@/utils/db'; // Utility to connect to MongoDB

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password, phone, location } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if supervisor already exists
    const existing = await Supervisor.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Supervisor already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new supervisor
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
    console.error('Register API Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
