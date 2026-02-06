import dbConnect from "@/utils/db";
import Task from "@/model/Task";
import { NextResponse } from "next/server";

// Handle CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// DELETE a title by ID from URL
export async function DELETE(_, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required in URL" }, { status: 400 });
    }

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Title deleted successfully", data: deleted },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;

  } catch (error) {
    console.error("❌ Error deleting task:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
