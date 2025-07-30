// import { NextResponse } from 'next/server';
// import connectDB from '@/utils/db'; // make sure this connects to your MongoDB
// import SuperAdmin from '@/model/SuperAdmin';

// export async function PUT(req) {
//   try {
//     await connectDB();
//     const { id, status } = await req.json();

//     const updated = await SuperAdmin.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ message: 'Client not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Status updated', client: updated }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import SuperAdmin from '@/model/SuperAdmin';
import User from '@/model/User';

export async function PUT(req) {
  try {
    await connectDB();

    const { id, status } = await req.json(); // `id` is SuperAdmin._id and also used as companyId in User

    // 1. Update SuperAdmin by _id
    const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSuperAdmin) {
      return NextResponse.json({ message: 'SuperAdmin not found' }, { status: 404 });
    }

    // 2. Update all Users with matching companyId
    const userUpdateResult = await User.updateMany(
      { companyId: id },
      { $set: { status } }
    );

    return NextResponse.json({
      message: 'Status updated for SuperAdmin and related Users',
      superAdmin: updatedSuperAdmin,
      userUpdateResult,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
