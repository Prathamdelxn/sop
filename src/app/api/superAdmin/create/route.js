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
import Company from "@/model/Company";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      status,
      logo,
      username,
      address,
      enabledFeatures = []
    } = body;

    if (!name || !email || !password || !phone || !status || !logo || !username || !address) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email or username already exists
    const existing = await SuperAdmin.findOne({
      $or: [{ email }, { username }]
    });

    if (existing) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }

    // Generate a unique Company ID
    const companyId = `comp_${Math.random().toString(36).substring(2, 9)}`;

    // Create Company Document
    const newCompany = new Company({
      companyId,
      name,
      email,
      phone,
      logo,
      enabledFeatures: enabledFeatures.length > 0 ? enabledFeatures : ['CHECKLIST'],
      status: 'Active'
    });
    await newCompany.save();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create SuperAdmin (Company Admin)
    const newAdmin = new SuperAdmin({
      name,
      email,
      password: hashedPassword,
      phone,
      status,
      logo,
      username,
      address,
      companyId, // Link to company
      features: enabledFeatures // Cache features for quick access
    });
    await newAdmin.save();

    // Nodemailer logic to send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Platform Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Company Admin Account Created",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Welcome, ${name}!</h2>
          <p>Your company admin account has been created for <strong>${name}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Company ID:</strong> ${companyId}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><strong>Features enabled:</strong> ${enabledFeatures.join(", ") || "None"}</p>
          <br/>
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/login" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log in to your Dashboard</a>
          <br/><br/>
          <p>Regards,<br/>System Support Team</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Email sending failed:", mailError);
      // We still return 201 as the account was created
    }

    return NextResponse.json(
      { success: true, message: "Company and Admin created successfully", admin: newAdmin },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating Company Admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

