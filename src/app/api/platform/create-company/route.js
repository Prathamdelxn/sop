import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import Company from "@/model/Company";
import SuperAdmin from "@/model/SuperAdmin";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { 
      companyName, 
      companyEmail, 
      companyPhone, 
      companyId, 
      enabledFeatures,
      adminName,
      adminEmail,
      adminUsername,
      adminPassword,
      adminPhone,
      adminAddress,
      adminLogo
    } = body;

    // 1. Basic Validation
    if (!companyName || !companyId || !adminUsername || !adminPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Check if Company or Admin exists
    const existingCompany = await Company.findOne({ companyId });
    if (existingCompany) {
      return NextResponse.json({ error: "Company ID already exists" }, { status: 409 });
    }

    const existingAdmin = await SuperAdmin.findOne({ 
      $or: [{ email: adminEmail }, { username: adminUsername }] 
    });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin email or username already exists" }, { status: 409 });
    }

    // 3. Create Company
    const newCompany = new Company({
      name: companyName,
      email: companyEmail || adminEmail,
      phone: companyPhone || adminPhone,
      companyId,
      enabledFeatures: enabledFeatures || ["CHECKLIST"],
      logo: adminLogo || ""
    });

    await newCompany.save();

    // 4. Create Company Admin (SuperAdmin model)
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const newAdmin = new SuperAdmin({
      name: adminName,
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      phone: adminPhone,
      address: adminAddress,
      logo: adminLogo,
      companyId, // Link to company
      status: "active",
      role: "company-admin"
    });

    await newAdmin.save();

    return NextResponse.json({ 
      message: "Company and Admin created successfully", 
      company: newCompany,
      admin: { username: newAdmin.username, email: newAdmin.email } 
    }, { status: 201 });

  } catch (error) {
    console.error("Error in platform creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
