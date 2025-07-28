// /app/api/supermanager/fetchById/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/db";
import SuperManager from "@/model/SuperManager";

export const dynamic = "force-dynamic"; // Required for dynamic route

export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const manager = await SuperManager.findById(id);

    if (!manager) {
      return NextResponse.json({ success: false, message: "SuperManager not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, manager });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch SuperManager", error }, { status: 500 });
  }
}
