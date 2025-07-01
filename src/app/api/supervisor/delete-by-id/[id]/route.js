import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Supervisor from '@/model/Supervisor';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedSupervisor = await Supervisor.findByIdAndDelete(id);

    if (!deletedSupervisor) {
      return NextResponse.json({ success: false, message: 'Supervisor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
