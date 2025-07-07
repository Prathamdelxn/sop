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

// Create a full Title document with task/subtask image, duration & status logic
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Enrich stages, tasks, subtasks
    if (Array.isArray(body.stages)) {
      body.stages.forEach(stage => {
        if (Array.isArray(stage.tasks)) {
          stage.tasks.forEach(task => {
            // ✅ Ensure task.duration is valid
            if (typeof task.duration !== "object" || task.duration === null) {
              task.duration = {
                min: 0,
                max: 0,
              };
            } else {
              task.duration.min = task.duration.min ?? 0;
              task.duration.max = task.duration.max ?? 0;
            }

            // ✅ Ensure task.image is a single object with array of URLs
            if (typeof task.image !== "object" || task.image === null) {
              task.image = {
                title: "",
                description: "",
                url: [],
              };
            } else {
              task.image.title = task.image.title ?? "";
              task.image.description = task.image.description ?? "";
              task.image.url = Array.isArray(task.image.url) ? task.image.url : [];
            }

            // ✅ Subtask logic
            if (Array.isArray(task.subtasks)) {
              task.subtasks.forEach(sub => {
                sub.verified = sub.verified ?? false;
                sub.completed = sub.completed ?? false;

                // Subtask image is still a single object with one URL
                sub.image = sub.image ?? {
                  title: "",
                  description: "",
                  url: ""
                };
              });

              task.completed = task.subtasks.every(sub => sub.completed);
              task.verified = task.subtasks.every(sub => sub.verified);
            } else {
              task.verified = task.verified ?? false;
              task.completed = task.completed ?? false;
            }
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
