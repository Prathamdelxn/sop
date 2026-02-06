import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db"; // Adjust path if different
import SuperManager from "@/model/SuperManager"; // Adjust path if different

export const dynamic = "force-dynamic"; // optional: ensures dynamic rendering

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await SuperManager.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create superManager
    const newSuperManager = new SuperManager({
      username,
      email,
      password: hashedPassword,
    });

    await newSuperManager.save();

    return NextResponse.json(
      {
        success: true,
        message: "Super Manager created successfully.",
        user: {
          id: newSuperManager._id,
          username: newSuperManager.username,
          email: newSuperManager.email,
          role: newSuperManager.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Super Manager:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
