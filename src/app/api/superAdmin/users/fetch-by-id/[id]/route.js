import { NextResponse } from "next/server";
import connectDB from "@/utils/db"; // adjust path if different
import User from "@/model/User"; // adjust path if different

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
