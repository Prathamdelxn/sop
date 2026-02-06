// /app/api/supervisor/auth/login/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Supervisor from '@/model/Supervisor';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const supervisor = await Supervisor.findOne({ email });

    if (!supervisor) {
      return NextResponse.json({ message: 'Supervisor not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, supervisor.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
   const token = jwt.sign(
  {
    id: supervisor._id,
    email: supervisor.email,
    role: 'supervisor',
  },
  process.env.JWT_SECRET, // <=== this line
  { expiresIn: '7d' }
);


    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email,
        role: 'supervisor',
        location: supervisor.location,
        phone: supervisor.phone,
        status: supervisor.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
