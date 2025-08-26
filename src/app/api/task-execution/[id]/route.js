// // app/api/super-admin/[id]/users/route.js
// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import SuperAdmin from '@/model/SuperAdmin';
// import User from '@/model/User';

// export async function GET(req, { params }) {
//   await dbConnect();

//   const { id } = params;

//   try {
//     // 1. Find SuperAdmin
//     const superadmin = await SuperAdmin.findById(id);

//     if (!superadmin) {
//       return NextResponse.json({ message: 'SuperAdmin not found' }, { status: 404 });
//     }

//     // 2. Get role titles with "Task Execution"
//     const matchingRoles = superadmin.workerRole
//       ?.filter(role => role.task?.includes("Task Execution"))
//       .map(role => role.title);

//     if (!matchingRoles || matchingRoles.length === 0) {
//       return NextResponse.json({ users: [], matchingRoles: [] }, { status: 200 });
//     }
// console.log(matchingRoles);
//     // 3. Find Users whose role matches and companyId matches superadmin id
//     const users = await User.find({
//       role: { $in: matchingRoles },
//       companyId: id,
//     });
//     console.log("asdf",users);

//     return NextResponse.json({ users, matchingRoles }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// app/api/super-admin/[id]/users/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import SuperAdmin from '@/model/SuperAdmin';
import User from '@/model/User';

// helper function to slugify role titles
function slugifyRole(title) {
  return title
    .toLowerCase()        // convert to lowercase
    .trim()               // remove spaces around
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/[^\w-]/g, ''); // remove special characters
}

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    // 1. Find SuperAdmin
    const superadmin = await SuperAdmin.findById(id);

    if (!superadmin) {
      return NextResponse.json({ message: 'SuperAdmin not found' }, { status: 404 });
    }

    // 2. Get role titles with "Task Execution" and slugify them
    const matchingRoles = superadmin.workerRole
      ?.filter(role => role.task?.includes("Task Execution"))
      .map(role => slugifyRole(role.title));  // convert to slug

    if (!matchingRoles || matchingRoles.length === 0) {
      return NextResponse.json({ users: [], matchingRoles: [] }, { status: 200 });
    }

    console.log("Normalized Roles:", matchingRoles);

    // 3. Find Users whose role matches and companyId matches superadmin id
    const users = await User.find({
      role: { $in: matchingRoles },
      companyId: id,
    });

    console.log("Matched Users:", users);

    return NextResponse.json({ users, matchingRoles }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
