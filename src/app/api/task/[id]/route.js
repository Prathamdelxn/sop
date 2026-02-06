import dbConnect from "@/utils/db";
import Prototype from "@/model/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Recursive function to normalize tasks at any depth
function normalizeTask(task, level = 0, order = 0) {
  const normalizedTask = {
    title: task?.title || "",
    description: task?.description || "",
    minDuration: task?.minDuration || 0,
    maxDuration: task?.maxDuration || 0,
    minTime: {
      hours: task?.minTime?.hours || 0,
      minutes: task?.minTime?.minutes || 0,
      seconds: task?.minTime?.seconds || 0,
    },
    maxTime: {
      hours: task?.maxTime?.hours || 0,
      minutes: task?.maxTime?.minutes || 0,
      seconds: task?.maxTime?.seconds || 0,
    },
    attachedImages: Array.isArray(task?.attachedImages)
      ? task.attachedImages.map(img => ({
          name: img?.name || "",
          description: img?.description || "",
          url: img?.url || "",
          public_id: img?.public_id || "",
          size: img?.size || 0,
          isUploading: img?.isUploading || false,
        }))
      : [],
    imageTitle: task?.imageTitle || "",
    imageDescription: task?.imageDescription || "",
    subtasks: [],  // always init
    level,
    order
  };

  // ✅ Always recurse, even if empty
  if (Array.isArray(task?.subtasks) && task.subtasks.length > 0) {
    normalizedTask.subtasks = task.subtasks.map((subtask, index) =>
      normalizeTask(subtask, level + 1, index)
    );
  }

  // ✅ Duration fallback
  if (!normalizedTask.minDuration && normalizedTask.minTime) {
    normalizedTask.minDuration =
      normalizedTask.minTime.hours * 60 + normalizedTask.minTime.minutes;
  }
  if (!normalizedTask.maxDuration && normalizedTask.maxTime) {
    normalizedTask.maxDuration =
      normalizedTask.maxTime.hours * 60 + normalizedTask.maxTime.minutes;
  }

  return normalizedTask;
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
    console.dir(body,{depth:null});

    if (!body.name) {
      return NextResponse.json({ error: "Prototype name is required" }, { status: 400 });
    }

    // Normalize stages and tasks recursively
    // if (Array.isArray(body.stages)) {
    //   body.stages = body.stages.map((stage, stageIndex) => {
    //     const normalizedStage = {
    //       name: stage?.name || `Stage ${stageIndex + 1}`,
    //       order: stage?.order ?? stageIndex,
    //       tasks: []
    //     };

    //     if (Array.isArray(stage.tasks)) {
    //       normalizedStage.tasks = stage.tasks.map((task, taskIndex) => {
    //         return normalizeTask(task, 0, taskIndex);
    //       });
    //     }

    //     return normalizedStage;
    //   });
    // } else {
    //   body.stages = [];
    // }
  

console.log("dd")
 console.dir(body,{depth:null});

    const updatedPrototype = await Prototype.findByIdAndUpdate(
      id,
      { 
        ...body, 
        status: "InProgress",  
        rejectionReason: null, 
        reviews: [], 
        approvers: [],   
        updatedAt: new Date() 
      },
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