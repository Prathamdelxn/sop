// // import dbConnect from "@/utils/db";
// // import Task from "@/model/Task";
// // import { NextResponse } from "next/server";

// // // Handle preflight CORS
// // export async function OPTIONS() {
// //   const response = NextResponse.json({}, { status: 200 });
// //   response.headers.set("Access-Control-Allow-Origin", "*");
// //   response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
// //   response.headers.set("Access-Control-Allow-Headers", "Content-Type");
// //   return response;
// // }

// // // Create a full Title document with task/subtask image, duration & status logic
// // export async function POST(req) {
// //   await dbConnect();

// //   try {
// //     const body = await req.json();

// //     if (!body.title) {
// //       return NextResponse.json({ error: "Title is required" }, { status: 400 });
// //     }

// //     // Enrich stages, tasks, subtasks
// //     if (Array.isArray(body.stages)) {
// //       body.stages.forEach(stage => {
// //         if (Array.isArray(stage.tasks)) {
// //           stage.tasks.forEach(task => {
// //             // ✅ Ensure task.duration is valid
// //             if (typeof task.duration !== "object" || task.duration === null) {
// //               task.duration = {
// //                 min: 0,
// //                 max: 0,
// //               };
// //             } else {
// //               task.duration.min = task.duration.min ?? 0;
// //               task.duration.max = task.duration.max ?? 0;
// //             }

// //             // ✅ Ensure task.image is a single object with array of URLs
// //             if (typeof task.image !== "object" || task.image === null) {
// //               task.image = {
// //                 title: "",
// //                 description: "",
// //                 url: [],
// //               };
// //             } else {
// //               task.image.title = task.image.title ?? "";
// //               task.image.description = task.image.description ?? "";
// //               task.image.url = Array.isArray(task.image.url) ? task.image.url : [];
// //             }

// //             // ✅ Subtask logic
// //             if (Array.isArray(task.subtasks)) {
// //               task.subtasks.forEach(sub => {
// //                 sub.verified = sub.verified ?? false;
// //                 sub.completed = sub.completed ?? false;

// //                 // Subtask image is still a single object with one URL
// //                 sub.image = sub.image ?? {
// //                   title: "",
// //                   description: "",
// //                   url: ""
// //                 };
// //               });

// //               task.completed = task.subtasks.every(sub => sub.completed);
// //               task.verified = task.subtasks.every(sub => sub.verified);
// //             } else {
// //               task.verified = task.verified ?? false;
// //               task.completed = task.completed ?? false;
// //             }
// //           });
// //         }
// //       });
// //     }

// //     // Save to DB
// //     const createdDoc = await Task.create(body);

// //     const response = NextResponse.json(
// //       { message: "Title created successfully", data: createdDoc },
// //       { status: 201 }
// //     );
// //     response.headers.set("Access-Control-Allow-Origin", "*");
// //     return response;

// //   } catch (error) {
// //     console.error("Error creating Title:", error);
// //     const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //     response.headers.set("Access-Control-Allow-Origin", "*");
// //     return response;
// //   }
// // }


// import dbConnect from "@/utils/db";
// import Task from "@/model/Task";
// import { NextResponse } from "next/server";

// function generateNextSopNumber(latest) {
//   if (!latest) return "PRO-MOD-01";

//   const match = latest.match(/PRO-MOD-(\d+)/);
//   const currentNum = match ? parseInt(match[1]) : 0;
//   const nextNum = currentNum + 1;
//   return `PRO-MOD-${String(nextNum).padStart(2, "0")}`;
// }

// // Recursive function to normalize subtasks
// function normalizeSubtask(subtask) {
//   subtask.title = subtask?.title || "";
//   subtask.description = subtask?.description || "";

//   subtask.duration = {
//     min: subtask?.duration?.min || "0",
//     max: subtask?.duration?.max || "0",
//   };

//   subtask.image = {
//     title: subtask?.image?.title || "",
//     description: subtask?.image?.description || "",
//     url: Array.isArray(subtask?.image?.url) ? subtask.image.url : [],
//   };

//   subtask.status = subtask?.status ?? false;
//   subtask.completed = subtask?.completed ?? false;

//   if (Array.isArray(subtask.subtasks)) {
//     subtask.subtasks = subtask.subtasks.map(normalizeSubtask);
//   } else {
//     subtask.subtasks = [];
//   }

//   return subtask;
// }

// // POST /api/task/create
// export async function POST(req) {
//   await dbConnect();

//   try {
//     const body = await req.json();

//     if (!body.title) {
//       return NextResponse.json({ error: "Title is required" }, { status: 400 });
//     }

//     // ✅ assignedEquipment should be an array
//     body.assignedEquipment = Array.isArray(body.assignedEquipment) ? body.assignedEquipment : [];

//     // ✅ Normalize stages
//     if (Array.isArray(body.stages)) {
//       body.stages = body.stages.map(stage => {
//         stage.title = stage.title || "";

//         // ✅ assignedMember should be string
//         stage.assignedMember = typeof stage.assignedMember === "string" ? stage.assignedMember : "";

//         // ✅ Normalize tasks
//         if (Array.isArray(stage.tasks)) {
//           stage.tasks = stage.tasks.map(task => {
//             task.title = task?.title || "";
//             task.description = task?.description || "";

//             task.duration = {
//               min: task?.duration?.min || "0",
//               max: task?.duration?.max || "0",
//             };

//             task.image = {
//               title: task?.image?.title || "",
//               description: task?.image?.description || "",
//               url: Array.isArray(task?.image?.url) ? task.image.url : [],
//             };

//             task.status = task?.status ?? false;
//             task.completed = task?.completed ?? false;

//             if (Array.isArray(task.subtasks)) {
//               task.subtasks = task.subtasks.map(normalizeSubtask);
//             } else {
//               task.subtasks = [];
//             }

//             return task;
//           });
//         } else {
//           stage.tasks = [];
//         }

//         return stage;
//       });
//     } else {
//       body.stages = [];
//     }

//     // Save to MongoDB
//     const createdDoc = await Task.create(body);

//     const response = NextResponse.json(
//       { message: "Task document created successfully", data: createdDoc },
//       { status: 201 }
//     );
//     response.headers.set("Access-Control-Allow-Origin", "*");
//     return response;

//   } catch (error) {
//     console.error("Error creating Task document:", error);
//     const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     response.headers.set("Access-Control-Allow-Origin", "*");
//     return response;
//   }
// }


import dbConnect from "@/utils/db";
import Prototype from "@/model/Task";
import { NextResponse } from "next/server";

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
  // Ensure required fields exist
  task.title = task?.title || "";
  task.description = task?.description || "";
  
  // Duration fields
  task.minDuration = task?.minDuration || 0;
  task.maxDuration = task?.maxDuration || 0;
  
  // Time objects
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
  
  // Image attachments
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
  
  // Recursively normalize subtasks
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

// POST /api/prototypes/create
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Prototype name is required" }, { status: 400 });
    }
 const existingPrototype = await Prototype.findOne({ name: body.name });
    if (existingPrototype) {
      return NextResponse.json({ error: "Checklist name already exists" }, { status: 400 });
    }
    // Normalize stages
    if (Array.isArray(body.stages)) {
      body.stages = body.stages.map(stage => {
        stage.name = stage?.name || `Stage ${body.stages.indexOf(stage) + 1}`;
        stage.order = stage?.order || body.stages.indexOf(stage);
        
        // Normalize tasks
        if (Array.isArray(stage.tasks)) {
          stage.tasks = stage.tasks.map(task => {
            const normalized = normalizeTask(task);
            normalized.level = 0; // Top-level tasks
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

    // Calculate durations if only time objects are provided
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

    // Create the prototype document
    const createdPrototype = await Prototype.create(body);

    const response = NextResponse.json(
      { 
        message: "Prototype created successfully", 
        data: createdPrototype 
      },
      { status: 201 }
    );
    
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("Error creating prototype:", error);
    const response = NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}