import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db"; // make sure you have a DB connection helper
import User from "@/model/User";    // path to your user model

export const dynamic = "force-dynamic"; // optional: allows API to run on every request

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      username,
      companyId,
      status,
      phone,
      task,
      role,
      location 
    } = body;

    // 1. Check for existing username (within the same company)
    const usernameExists = await User.findOne({ username, companyId });
    if (usernameExists) {
      return NextResponse.json({ error: "Username already taken within this company" }, { status: 400 });
    }

    // 2. Check for existing email (if provided, within the same company)
    if (email && email.trim() !== "") {
      const emailExists = await User.findOne({ email, companyId });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use within this company" }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || "", 10);

    // Create new user (Ensure optional unique fields are handled for partial index)
    const newUser = new User({
      name,
      email: (email && email.trim() !== "") ? email : null, // Set to null as requested
      password: hashedPassword,
      username: (username && username.trim() !== "") ? username : undefined,
      companyId,
      status,
      phone: (phone && phone.trim() !== "") ? phone : undefined,
      task,
      role,
      location 
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    
    let message = "Internal Server Error";
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {}).join(", ") || "field";
      message = `Duplicate field error: ${field} already exists.`;
    } else {
      message = error.message;
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
