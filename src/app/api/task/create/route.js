import dbConnect from "@/utils/db";
import Task from "@/model/Task";
import { NextResponse } from "next/server";

// Handle preflight CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Create a full Title document with task/subtask status & image support
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Task & Subtask logic
    if (Array.isArray(body.stages)) {
      body.stages.forEach(stage => {
        // ✅ No stage.description expected here

        if (Array.isArray(stage.tasks)) {
          stage.tasks.forEach(task => {
            // Subtasks setup
            if (Array.isArray(task.subtasks)) {
              task.subtasks.forEach(sub => {
                sub.verified = sub.verified ?? false;
                sub.completed = sub.completed ?? false;
                sub.image = sub.image ?? null; // ✅ Optional image
              });

              // Task completion based on subtasks
              task.completed = task.subtasks.every(sub => sub.completed);
              task.verified = task.subtasks.every(sub => sub.verified);
            } else {
              task.verified = task.verified ?? false;
              task.completed = task.completed ?? false;
            }

            task.image = task.image ?? null; // ✅ Optional image
          });
        }
      });
    }

    // Save to DB
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
