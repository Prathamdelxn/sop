import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db";
import User from "@/model/User";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();
console.log(body);
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
      location,
      plantId
    } = body;

    // Find the existing user
    const existingUser = await User.findById(id);
    console.log(existingUser);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is being changed to one that already exists (within the same company)
    const targetEmail = email || existingUser.email;
    const targetCompanyId = companyId || existingUser.companyId;

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, companyId: targetCompanyId });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use within this company" }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      username: username || existingUser.username,
      companyId: companyId || existingUser.companyId,
      plantId: plantId !== undefined ? (plantId || null) : existingUser.plantId,
      status: status || existingUser.status,
      phone: phone || existingUser.phone,
      task: task || existingUser.task,
      role: role || existingUser.role,
      location: location || existingUser.location
    };

    // Only update password if a new one was provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...updateData,
        email: (updateData.email && updateData.email.trim() !== "") ? updateData.email : undefined
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(
      { 
        message: "User updated successfully", 
        user: updatedUser 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    const message = error.code === 11000 ? "Duplicate field error" : error.message;
    return NextResponse.json(
      { error: message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}