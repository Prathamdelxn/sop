
// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import SuperAdmin from "@/model/SuperAdmin";

// export async function POST(req) {
//   await connectDB();
//   const { email, username, phone, idToExclude } = await req.json();

//   const conditions = [];

//   if (email) {
//     conditions.push(SuperAdmin.findOne({
//       email,
//       ...(idToExclude && { _id: { $ne: idToExclude } }),
//     }));
//   } else {
//     conditions.push(Promise.resolve(null));
//   }

//   if (username) {
//     conditions.push(SuperAdmin.findOne({
//       username,
//       ...(idToExclude && { _id: { $ne: idToExclude } }),
//     }));
//   } else {
//     conditions.push(Promise.resolve(null));
//   }

//   if (phone) {
//     conditions.push(SuperAdmin.findOne({
//       phone,
//       ...(idToExclude && { _id: { $ne: idToExclude } }),
//     }));
//   } else {
//     conditions.push(Promise.resolve(null));
//   }

//   const [emailDoc, usernameDoc, phoneDoc] = await Promise.all(conditions);

//   return NextResponse.json({
//     emailExists: !!emailDoc,
//     usernameExists: !!usernameDoc,
//     phoneExists: !!phoneDoc
//   });
// }


import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import User from "@/model/User";
import SuperManager from "@/model/SuperManager";

export async function POST(req) {
  await connectDB();
  const { email, username, phone, idToExclude } = await req.json();

  const emailQuery = { email };
  const usernameQuery = { username };
  const phoneQuery = { phone };

  if (idToExclude) {
    emailQuery._id = { $ne: idToExclude };
    usernameQuery._id = { $ne: idToExclude };
    phoneQuery._id = { $ne: idToExclude };
  }

  const [
    superAdminEmail, userEmail, superManagerEmail,
    superAdminUsername, userUsername, superManagerUsername,
    superAdminPhone, userPhone
  ] = await Promise.all([
    email ? SuperAdmin.findOne(emailQuery) : null,
    email ? User.findOne(emailQuery) : null,
    email ? SuperManager.findOne(emailQuery) : null,

    username ? SuperAdmin.findOne(usernameQuery) : null,
    username ? User.findOne(usernameQuery) : null,
    username ? SuperManager.findOne(usernameQuery) : null,

    phone ? SuperAdmin.findOne(phoneQuery) : null,
    phone ? User.findOne(phoneQuery) : null,
    // No phone field in SuperManager schema
  ]);

  return NextResponse.json({
    emailExists: !!(superAdminEmail || userEmail || superManagerEmail),
    usernameExists: !!(superAdminUsername || userUsername || superManagerUsername),
    phoneExists: !!(superAdminPhone || userPhone), // SuperManager has no phone
  });
}
