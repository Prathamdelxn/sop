
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import SuperManager from "@/model/SuperManager";
import User from "@/model/User"; // ✅ import User model

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    // Try to find user in all collections
    const superAdmin = await SuperAdmin.findOne({ username });
    const superManager = await SuperManager.findOne({ username });
    const regularUser = await User.findOne({ username });

    const user = superAdmin || superManager || regularUser;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Build response data
    const responseUser = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Add `status` if SuperAdmin or regular User
    if (superAdmin) {
      responseUser.status = superAdmin.status;
    } else if (regularUser) {
      responseUser.status = regularUser.status;
      responseUser.companyId = regularUser.companyId;
      responseUser.phone = regularUser.phone;
      responseUser.location = regularUser.location;
      responseUser.task = regularUser.task;
      responseUser.name = regularUser.name;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        token,
        user: responseUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
