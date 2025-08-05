// app/api/super-admin/[id]/users/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import SuperAdmin from '@/model/SuperAdmin';
import User from '@/model/User';

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    // 1. Find SuperAdmin
    const superadmin = await SuperAdmin.findById(id);

    if (!superadmin) {
      return NextResponse.json({ message: 'SuperAdmin not found' }, { status: 404 });
    }

    // 2. Get role titles with "Task Execution"
    const matchingRoles = superadmin.workerRole
      ?.filter(role => role.task?.includes("Task Execution"))
      .map(role => role.title);

    if (!matchingRoles || matchingRoles.length === 0) {
      return NextResponse.json({ users: [], matchingRoles: [] }, { status: 200 });
    }

    // 3. Find Users whose role matches and companyId matches superadmin id
    const users = await User.find({
      role: { $in: matchingRoles },
      companyId: id,
    });

    return NextResponse.json({ users, matchingRoles }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}