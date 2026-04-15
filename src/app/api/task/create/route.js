import dbConnect from "@/utils/db";
import { NextResponse } from "next/server";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";

// Handle preflight CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Recursive function to normalize tasks and subtasks
function normalizeTask(task) {
  task.title = task?.title || "";
  task.description = task?.description || "";
  
  task.minDuration = task?.minDuration || 0;
  task.maxDuration = task?.maxDuration || 0;
  
  task.minTime = {
    hours: task?.minTime?.hours || 0,
    minutes: task?.minTime?.minutes || 0,
    seconds: task?.minTime?.seconds || 0
  };
  
  task.maxTime = {
    hours: task?.maxTime?.hours || 0,
    minutes: task?.maxTime?.minutes || 0,
    seconds: task?.maxTime?.seconds || 0
  };
  
  task.attachedImages = Array.isArray(task?.attachedImages) 
    ? task.attachedImages.map(img => ({
        name: img?.name || "",
        description: img?.description || "",
        url: img?.url || "",
        public_id: img?.public_id || "",
        size: img?.size || 0,
        isUploading: img?.isUploading || false
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

// POST /api/task/create - Multi-tenant enabled
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { companyId, name } = body;

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required for data isolation" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Prototype (Checklist) name is required" }, { status: 400 });
    }

    // Get dynamic model for this company
    const PrototypeModel = PrototypeStatic; 
    const __tenantCompanyId = companyId;

    const existingPrototype = await PrototypeModel.findOne({ name, companyId: __tenantCompanyId });
    if (existingPrototype) {
      return NextResponse.json({ error: "Checklist with this name already exists for your company" }, { status: 400 });
    }

    // Normalize stages
    if (Array.isArray(body.stages)) {
      body.stages = body.stages.map(stage => {
        stage.name = stage?.name || `Stage ${body.stages.indexOf(stage) + 1}`;
        stage.order = stage?.order || body.stages.indexOf(stage);
        
        if (Array.isArray(stage.tasks)) {
          stage.tasks = stage.tasks.map(task => {
            const normalized = normalizeTask(task);
            normalized.level = 0;
            normalized.order = stage.tasks.indexOf(task);
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

    // Calculate durations
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

    // Create the prototype document in company-specific collection
    const createdPrototype = await PrototypeModel.create({ ...body, companyId: __tenantCompanyId });

    if (createdPrototype && createdPrototype._id) {
       await CompanyStatic.findOneAndUpdate(
           { companyId },
           { $push: { prototypes: createdPrototype._id } }
       );
    }

    const response = NextResponse.json(
      { message: "Prototype created successfully", data: createdPrototype },
      { status: 201 }
    );
    
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("Error creating prototype:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}