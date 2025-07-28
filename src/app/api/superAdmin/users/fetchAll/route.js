import { NextResponse } from "next/server";
import connectDB from "@/utils/db"; // your DB connection utility
import User from "@/model/User";    // your User model path

export const dynamic = "force-dynamic"; // optional for fresh data every call

export async function GET() {
  await connectDB();

  try {
    const users = await User.find().sort({ createdAt: -1 }); // optional: latest first
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
