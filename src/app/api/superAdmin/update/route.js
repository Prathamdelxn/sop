import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import SuperAdmin from '@/model/SuperAdmin';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      id,
      name,
      email,
      phone,
      address,
      username,
      password,
      logo,
      status
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'SuperAdmin ID is required' }, { status: 400 });
    }

    const updateFields = {
      name,
      email,
      phone,
      address,
      username,
      logo,
      status
    };

    // Only hash and update password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updated = await SuperAdmin.findByIdAndUpdate(id, updateFields, {
      new: true
    });

    if (!updated) {
      return NextResponse.json({ error: 'SuperAdmin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'SuperAdmin updated successfully', updated }, { status: 200 });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
