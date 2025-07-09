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

// Recursive function to normalize subtasks
function normalizeSubtask(subtask) {
  subtask.title = subtask?.title || "";
  subtask.description = subtask?.description || "";

  subtask.duration = {
    min: subtask?.duration?.min || "0",
    max: subtask?.duration?.max || "0",
  };

  subtask.image = {
    title: subtask?.image?.title || "",
    description: subtask?.image?.description || "",
    url: Array.isArray(subtask?.image?.url) ? subtask.image.url : [],
  };

  subtask.status = subtask?.status ?? false;
  subtask.completed = subtask?.completed ?? false;

  if (Array.isArray(subtask.subtasks)) {
    subtask.subtasks = subtask.subtasks.map(normalizeSubtask);
  } else {
    subtask.subtasks = [];
  }

  return subtask;
}

// POST /api/task/create
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // ✅ assignedEquipment should be an array
    body.assignedEquipment = Array.isArray(body.assignedEquipment) ? body.assignedEquipment : [];

    // ✅ Normalize stages
    if (Array.isArray(body.stages)) {
      body.stages = body.stages.map(stage => {
        stage.title = stage.title || "";

        // ✅ assignedMember should be string
        stage.assignedMember = typeof stage.assignedMember === "string" ? stage.assignedMember : "";

        // ✅ Normalize tasks
        if (Array.isArray(stage.tasks)) {
          stage.tasks = stage.tasks.map(task => {
            task.title = task?.title || "";
            task.description = task?.description || "";

            task.duration = {
              min: task?.duration?.min || "0",
              max: task?.duration?.max || "0",
            };

            task.image = {
              title: task?.image?.title || "",
              description: task?.image?.description || "",
              url: Array.isArray(task?.image?.url) ? task.image.url : [],
            };

            task.status = task?.status ?? false;
            task.completed = task?.completed ?? false;

            if (Array.isArray(task.subtasks)) {
              task.subtasks = task.subtasks.map(normalizeSubtask);
            } else {
              task.subtasks = [];
            }

            return task;
          });
        } else {
          stage.tasks = [];
        }

        return stage;
      });
    } else {
      body.stages = [];
    }

    // Save to MongoDB
    const createdDoc = await Task.create(body);

    const response = NextResponse.json(
      { message: "Task document created successfully", data: createdDoc },
      { status: 201 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("Error creating Task document:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
