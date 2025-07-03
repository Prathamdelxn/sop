import dbConnect from "@/utils/db";
import Task from "@/model/Task";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const body = await req.json();

    // 1. Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // 2. Check if another document with the same title exists
    const existing = await Task.findOne({ title: body.title, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ error: "Another document with this title already exists" }, { status: 400 });
    }

    // 3. Validate duplicate stage names
    const stageNames = body.stages?.map(stage => stage.name);
    if (new Set(stageNames).size !== stageNames.length) {
      return NextResponse.json({ error: "Duplicate stage names found" }, { status: 400 });
    }

    // 4. Validate tasks/subtasks inside each stage
    for (const stage of body.stages || []) {
      const taskTitles = stage.tasks.map(task => task.title);
      if (new Set(taskTitles).size !== taskTitles.length) {
        return NextResponse.json({ error: `Duplicate task titles in stage "${stage.name}"` }, { status: 400 });
      }

      for (const task of stage.tasks || []) {
        const subtaskTitles = task.subtasks.map(sub => sub.title);
        if (new Set(subtaskTitles).size !== subtaskTitles.length) {
          return NextResponse.json({
            error: `Duplicate subtasks in task "${task.title}" of stage "${stage.name}"`
          }, { status: 400 });
        }
      }
    }

    // 5. Update document
    const updated = await Task.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Title updated successfully", data: updated },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("Error updating Task:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
