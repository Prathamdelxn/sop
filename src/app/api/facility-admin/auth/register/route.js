import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import FacilityAdmin from '@/model/FacilityAdmin'; // Ensure this is the correct model path
import dbConnect from '@/utils/db'; // DB connection utility

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password, phone, location } = await req.json();

    // Validation
    if (!name || !email || !password || !phone || !location) {
      return NextResponse.json(
        { message: 'All fields are required (name, email, password, phone, location)' },
        { status: 400 }
      );
    }

    // Check if Facility Admin already exists
    const existingAdmin = await FacilityAdmin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Facility Admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Facility Admin
    const facilityAdmin = await FacilityAdmin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: 'facility-admin',
      status: 'active',
    });

    // Respond with selected details
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
