import dbConnect from "@/utils/db";
import Prototype from "@/model/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Reuse your normalizeTask function
function normalizeTask(task) {
  task.title = task?.title || "";
  task.description = task?.description || "";

  task.minDuration = task?.minDuration || 0;
  task.maxDuration = task?.maxDuration || 0;

  task.minTime = {
    hours: task?.minTime?.hours || 0,
    minutes: task?.minTime?.minutes || 0,
    seconds: task?.minTime?.seconds || 0,
  };

  task.maxTime = {
    hours: task?.maxTime?.hours || 0,
    minutes: task?.maxTime?.minutes || 0,
    seconds: task?.maxTime?.seconds || 0,
  };

  task.attachedImages = Array.isArray(task?.attachedImages)
    ? task.attachedImages.map(img => ({
        name: img?.name || "",
        description: img?.description || "",
        url: img?.url || "",
        public_id: img?.public_id || "",
        size: img?.size || 0,
        isUploading: img?.isUploading || false,
      }))
    : [];

  task.imageTitle = task?.imageTitle || "";
  task.imageDescription = task?.imageDescription || "";

  if (Array.isArray(task.subtasks)) {
    task.subtasks = task.subtasks.map(subtask => {
      const normalized = normalizeTask(subtask);
      normalized.level = (task.level || 0) + 1;
      return normalized;
    });
  } else {
    task.subtasks = [];
  }

  return task;
}

// Handle PUT (update)
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid checklist ID" }, { status: 400 });
    }

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Prototype name is required" }, { status: 400 });
    }

    // Normalize stages and tasks
    if (Array.isArray(body.stages)) {
      body.stages = body.stages.map((stage, stageIndex) => {
        stage.name = stage?.name || `Stage ${stageIndex + 1}`;
        stage.order = stage?.order ?? stageIndex;

        if (Array.isArray(stage.tasks)) {
          stage.tasks = stage.tasks.map((task, taskIndex) => {
            const normalized = normalizeTask(task);
            normalized.level = 0;
            normalized.order = taskIndex;
            return normalized;
          });
        } else {
          stage.tasks = [];
        }
        return stage;
      });
    } else {
      body.stages = [];
    }

    // Calculate durations if needed
    body.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        if (!task.minDuration && task.minTime) {
          task.minDuration = task.minTime.hours * 60 + task.minTime.minutes;
        }
        if (!task.maxDuration && task.maxTime) {
          task.maxDuration = task.maxTime.hours * 60 + task.maxTime.minutes;
        }
      });
    });

    const updatedPrototype = await Prototype.findByIdAndUpdate(
      id,
      { ...body, status: "InProgress",  rejectionReason: null,    updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedPrototype) {
      return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Checklist updated successfully", data: updatedPrototype },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error updating checklist:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
