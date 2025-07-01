import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Supervisor from '@/model/Supervisor';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updateData = await req.json();

    // Prevent password update via this route (if needed)
    if ('password' in updateData) {
      delete updateData.password;
    }

    const updatedSupervisor = await Supervisor.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSupervisor) {
      return NextResponse.json({ success: false, message: 'Supervisor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, supervisor: updatedSupervisor });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
