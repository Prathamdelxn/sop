// app/api/assignment/fetchbyid/[companyId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Assignment from '@/model/NewAssignment'; // Or use NewAssignment

export async function GET(req, { params }) {
  await dbConnect();

  const { companyId } = params;

  if (!companyId) {
    return NextResponse.json({ message: 'companyId is required' }, { status: 400 });
  }

  try {
    const assignments = await Assignment.find({ companyId });
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
