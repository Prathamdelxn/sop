// import { NextResponse } from 'next/server';
// import connectDB from '@/utils/db';
// import SuperAdmin from '@/model/SuperAdmin';
// import bcrypt from 'bcryptjs';

// export async function PUT(request) {
//   try {
//     await connectDB();

//     const body = await request.json();
//     const {
//       id,
//       name,
//       email,
//       phone,
//       address,
//       username,
//       password,
//       logo,
//       status
//     } = body;

//     if (!id) {
//       return NextResponse.json({ error: 'SuperAdmin ID is required' }, { status: 400 });
//     }

//     const updateFields = {
//       name,
//       email,
//       phone,
//       address,
//       username,
//       logo,
//       status
//     };

//     // Only hash and update password if it's provided
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateFields.password = hashedPassword;
//     }

//     const updated = await SuperAdmin.findByIdAndUpdate(id, updateFields, {
//       new: true
//     });

//     if (!updated) {
//       return NextResponse.json({ error: 'SuperAdmin not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'SuperAdmin updated successfully', updated }, { status: 200 });

//   } catch (error) {
//     console.error('Update Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import SuperAdmin from '@/model/SuperAdmin';
import User from '@/model/User'; // make sure to import User model
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

    // Fetch the existing SuperAdmin to compare the status later
    const existingSuperAdmin = await SuperAdmin.findById(id);
    if (!existingSuperAdmin) {
      return NextResponse.json({ error: 'SuperAdmin not found' }, { status: 404 });
    }

    const updateFields = {
      name,
      email,
      phone,
      address,
      username,
      logo,
    };

    if (status) {
      updateFields.status = status;
    }

    // Only hash and update password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // Update SuperAdmin
    const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(id, updateFields, {
      new: true
    });

    // If status was updated, also update status for all Users with matching companyId
    if (status && status !== existingSuperAdmin.status) {
      const userUpdateResult = await User.updateMany(
        { companyId: id },
        { $set: { status } }
      );

      return NextResponse.json({
        message: 'SuperAdmin and related Users updated successfully',
        updatedSuperAdmin,
        userUpdateResult
      }, { status: 200 });
    }

    return NextResponse.json({
      message: 'SuperAdmin updated successfully',
      updatedSuperAdmin
    }, { status: 200 });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
