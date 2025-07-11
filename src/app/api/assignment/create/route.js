// /app/api/assignment/create/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/utils/db'; // your DB connection util
import NewAssignment from '@/model/NewAssignment';

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    console.log(body);
    const { generatedId, equipment, prototype } = body;

    // Validation
    if (!generatedId || !equipment || !prototype) {
      return NextResponse.json(
        { success: false, message: 'Missing fields' },
        { status: 400 }
      );
    }
    console.log(prototype)
    

    const newAssignment = await NewAssignment.create({
      generatedId,
      equipment,
      prototypeData:prototype,
    });
    console.log(newAssignment)
    return NextResponse.json({
      success: true,
      data: newAssignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
