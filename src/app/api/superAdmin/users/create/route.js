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

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      companyId,
      status,
      phone,
      task,
      role,
      location 
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
