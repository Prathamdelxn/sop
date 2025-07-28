import { NextResponse } from 'next/server';
import connectDB from '@/utils/db'; // make sure this connects to your MongoDB
import SuperAdmin from '@/model/SuperAdmin';

export async function PUT(req) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    const updated = await SuperAdmin.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated', client: updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
