import dbConnect from "@/utils/db";
import Admin from "@/model/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Handle OPTIONS request for preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(req) {
  await dbConnect();

  const { name, email, password, role } = await req.json();

  const userExists = await Admin.findOne({ email });
  if (userExists) {
    const response = NextResponse.json({ error: "User already exists" }, { status: 400 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashedPassword, role });

  const response = NextResponse.json({ message: "Admin created", admin: admin._id }, { status: 201 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
