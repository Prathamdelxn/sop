import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Operator from '@/model/Operator';
import dbConnect from '@/utils/db';

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password, phone, location } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if operator already exists
    const existing = await Operator.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Operator already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new operator
    const newOperator = await Operator.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: 'operator',
      status: 'active',
    });

    return NextResponse.json({
      message: 'Operator registered successfully',
      operator: {
        id: newOperator._id,
        name: newOperator.name,
        email: newOperator.email,
        role: newOperator.role,
        status: newOperator.status,
        phone: newOperator.phone,
        location: newOperator.location,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
