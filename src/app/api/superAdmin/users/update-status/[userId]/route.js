import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import User from '@/model/User';

export const dynamic = 'force-dynamic';

export async function PUT(req,{params}) {
  await connectDB();

  try {

    const { userId } = await params;
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Toggle status
    const newStatus = user.status === 'active' ? 'deactive' : 'active';
    user.status = newStatus;
    await user.save();

    return NextResponse.json({
      message: `User status updated to ${newStatus}`,
      user,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
