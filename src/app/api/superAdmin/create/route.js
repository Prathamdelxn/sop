// // app/api/superadmin/create/route.js

// import mongoose from "mongoose";
// import { NextResponse } from "next/server";
// import SuperAdmin from "@/model/SuperAdmin";
// import connectDB from "@/utils/db";
// import bcrypt from "bcryptjs";
// // Enable dynamic evaluation
// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   await connectDB(); // make sure this connects to MongoDB

//   try {
//     const body = await req.json();

//     const {
//       name,
//       email,
//       password,
//       phone,
//       status,
//       logo,
//       username,
//       address
//     } = body;

//     // Validate required fields
//     if (!name || !email || !password || !phone || !status || !logo || !username || !address) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     // Check if email or username already exists
//     const existing = await SuperAdmin.findOne({
//       $or: [{ email }, { username }]
//     });

//     if (existing) {
//       return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
//     }
//  const hashedPassword = await bcrypt.hash(password, 10);
//     // Create the new SuperAdmin
//     const newAdmin = new SuperAdmin({
//       name,
//       email,
//       password:hashedPassword, // You should hash this in production!
//       phone,
//       status,
//       logo,
//       username,
//       address
//     });

//     await newAdmin.save();

//     return NextResponse.json({ message: "SuperAdmin created successfully", admin: newAdmin }, { status: 201 });

//   } catch (error) {
//     console.error("Error creating SuperAdmin:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import SuperAdmin from "@/model/SuperAdmin";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      status,
      logo,
      username,
      address
    } = body;

    if (!name || !email || !password || !phone || !status || !logo || !username || !address) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await SuperAdmin.findOne({
      $or: [{ email }, { username }]
    });

    if (existing) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new SuperAdmin({
      name,
      email,
      password: hashedPassword,
      phone,
      status,
      logo,
      username,
      address
    });

    await newAdmin.save();

    // ✅ Nodemailer logic to send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // your email address
        pass: process.env.EMAIL_PASSWORD    // your app-specific password
      }
    });

    const mailOptions = {
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your SuperAdmin Account Details",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your Admin account has been created successfully.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please log in and Manage your Bussiness</p>
        <br/>
        <p>Regards,<br/>Support Team</p>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "SuperAdmin created and email sent", admin: newAdmin },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
