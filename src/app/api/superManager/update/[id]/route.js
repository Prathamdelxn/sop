import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import superManager from "@/model/SuperManager";
import bcrypt from "bcryptjs";

// Enable dynamic route handling
export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const body = await req.json();
    const { username, email, password } = body;

    let updatedFields = { username, email };

    // If password provided, hash it
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedManager = await superManager.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedManager) {
      return NextResponse.json({ success: false, message: "Manager not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Updated successfully", manager: updatedManager });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
