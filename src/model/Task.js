import mongoose from "mongoose";

// ✅ Subtask Schema
const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String, // ✅ NEW: Optional image field
  status: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
}, { _id: false });

// ✅ Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String, // ✅ NEW: Optional image field
  duration: Number, // in hours or days
  status: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  subtasks: [subtaskSchema],
}, { _id: false });

// ✅ Stage Schema
const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [taskSchema],
}, { _id: false });

// ✅ Main Task Document (Title)
const taskDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  stages: [stageSchema],
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);
