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
import Company from '@/model/Company';
import User from '@/model/User';
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
      status,
      enabledFeatures
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'SuperAdmin ID is required' }, { status: 400 });
    }

    // Fetch the existing SuperAdmin
    const existingSuperAdmin = await SuperAdmin.findById(id);
    if (!existingSuperAdmin) {
      return NextResponse.json({ error: 'SuperAdmin not found' }, { status: 404 });
    }

    const { companyId } = existingSuperAdmin;

    const adminUpdateFields = {
      name,
      email,
      phone,
      address,
      username,
      logo,
    };

    if (status) {
      adminUpdateFields.status = status;
    }

    if (enabledFeatures) {
      adminUpdateFields.features = enabledFeatures; // Update cache
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      adminUpdateFields.password = hashedPassword;
    }

    // Update SuperAdmin
    const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(id, adminUpdateFields, {
      new: true
    });

    // Update Company Record if exists
    if (companyId) {
      const companyUpdateFields = {
        name,
        email,
        phone,
        logo,
      };
      if (status) companyUpdateFields.status = status;
      if (enabledFeatures) companyUpdateFields.enabledFeatures = enabledFeatures;

      await Company.findOneAndUpdate({ companyId }, companyUpdateFields);

      // If status changed, propogate to Users too
      if (status && status !== existingSuperAdmin.status) {
        await User.updateMany(
          { companyId: companyId },
          { $set: { status } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Client and associated company records updated successfully',
      updatedSuperAdmin
    }, { status: 200 });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
