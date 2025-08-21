import dbConnect from "@/utils/db";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(req,{ params }) {
  try {
    await dbConnect();

  const { type } = params;
const { searchParams } = new URL(req.url);
const companyId = searchParams.get("companyId");
    console.log("dddeeeddd",type);

    const users = await User.find({ companyId: companyId, task: type });

    return NextResponse.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
