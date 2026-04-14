
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
  const { email, username, phone, idToExclude, companyId } = await req.json();

  const emailQuery = { email };
  const usernameQuery = { username };
  const phoneQuery = { phone };

  if (idToExclude) {
    emailQuery._id = { $ne: idToExclude };
    usernameQuery._id = { $ne: idToExclude };
    phoneQuery._id = { $ne: idToExclude };
  }

  // Define Company-Aware queries for Workers and Company Admins
  const userEmailQuery = { ...emailQuery };
  const userUsernameQuery = { ...usernameQuery };
  const userPhoneQuery = { ...phoneQuery };

  const superAdminEmailQuery = { ...emailQuery };
  const superAdminUsernameQuery = { ...usernameQuery };
  const superAdminPhoneQuery = { ...phoneQuery };

  if (companyId) {
    userEmailQuery.companyId = companyId;
    userUsernameQuery.companyId = companyId;
    userPhoneQuery.companyId = companyId;

    superAdminEmailQuery.companyId = companyId;
    superAdminUsernameQuery.companyId = companyId;
    superAdminPhoneQuery.companyId = companyId;
  }

  const [
    superAdminEmail, userEmail, superManagerEmail,
    superAdminUsername, userUsername, superManagerUsername,
    superAdminPhone, userPhone
  ] = await Promise.all([
    // Check Email (SuperManagers are global, Admins and Workers are scoped to companyId if provided)
    email ? SuperAdmin.findOne(superAdminEmailQuery) : null,
    email ? User.findOne(userEmailQuery) : null,
    email ? SuperManager.findOne(emailQuery) : null,

    // Check Username
    username ? SuperAdmin.findOne(superAdminUsernameQuery) : null,
    username ? User.findOne(userUsernameQuery) : null,
    username ? SuperManager.findOne(usernameQuery) : null,

    // Check Phone
    phone ? SuperAdmin.findOne(superAdminPhoneQuery) : null,
    phone ? User.findOne(userPhoneQuery) : null,
  ]);

  return NextResponse.json({
    emailExists: !!(superAdminEmail || userEmail || superManagerEmail),
    usernameExists: !!(superAdminUsername || userUsername || superManagerUsername),
    phoneExists: !!(superAdminPhone || userPhone),
  });
}
