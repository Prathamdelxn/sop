import { NextResponse } from "next/server";
import connectDB from "@/utils/db"; // your DB connection utility
import User from "@/model/User";    // your User model path

export const dynamic = "force-dynamic"; // optional for fresh data every call

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    const filter = companyId ? { companyId } : {};
    console.log(`Fetching users with filter: ${JSON.stringify(filter)}`);

    const users = await User.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
