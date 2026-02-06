// /app/api/supervisor/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Supervisor from '@/model/Supervisor';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid supervisor ID' }, { status: 400 });
  }

  try {
    const supervisor = await Supervisor.findById(id).select('-password'); // exclude password

    if (!supervisor) {
      return NextResponse.json({ message: 'Supervisor not found' }, { status: 404 });
    }

    return NextResponse.json({ supervisor });
  } catch (error) {
    console.error('Error fetching supervisor:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
