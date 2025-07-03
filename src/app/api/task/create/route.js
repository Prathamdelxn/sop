import dbConnect from "@/utils/db"; // Your DB connection utility
import Task from "@/model/Task";   // Your Mongoose model (title/stages/tasks/subtasks)
import { NextResponse } from "next/server";

// Handle preflight CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Create a full Title document
export async function POST(req) {
  await dbConnect(); // Ensure DB is connected

  try {
    const body = await req.json();

    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Save the full document to the database
    const createdDoc = await Task.create(body);

    const response = NextResponse.json(
      { message: "Title created successfully", data: createdDoc },
      { status: 201 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error creating Title:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
