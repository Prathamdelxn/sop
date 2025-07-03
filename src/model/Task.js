import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number, // e.g., in hours or days
  subtasks: [subtaskSchema],
}, { _id: false });

const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  tasks: [taskSchema],
}, { _id: false });

const taskDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "ERP Implementation"
  stages: [stageSchema],
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);
