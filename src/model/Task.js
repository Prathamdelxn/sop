// import mongoose from "mongoose";

// // ✅ Subtask Schema (With image object)
// const subtaskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   image: {
//     title: String,
//     description: String,
//     url: String,
//   },
//   status: { type: Boolean, default: false },
//   completed: { type: Boolean, default: false },
// }, { _id: false });

// // ✅ Task Schema (Supports multiple images & min/max duration)
// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   image: {
//     title: String,
//     description: String,
//     url: [String],  // <-- array of image URLs
//   },
//   duration: {
//     min: { type: Number, default: 0 },
//     max: { type: Number, default: 0 },
//   },
//   status: { type: Boolean, default: false },
//   completed: { type: Boolean, default: false },
//   subtasks: [subtaskSchema],
// }, { _id: false });




// // ✅ Stage Schema (No description)
// const stageSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   tasks: [taskSchema],
// }, { _id: false });

// // ✅ Main Task Document Schema
// const taskDocumentSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   stages: [stageSchema],
// }, { timestamps: true });
// delete mongoose.models.Task
// export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);
import mongoose from "mongoose";

// Recursive Subtask Schema (same as Task)
const recursiveSubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: {
    min: { type: String, default: "0" },
    max: { type: String, default: "0" }
  },
  image: {
    title: String,
    description: String,
    url: [String],
  },
  status: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  subtasks: [] // placeholder, will be replaced recursively
}, { _id: false });

// Assign self-recursion to enable infinite nesting
recursiveSubtaskSchema.add({
  subtasks: [recursiveSubtaskSchema]
});

// Task Schema (same structure as recursiveSubtaskSchema)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: {
    min: { type: String, default: "0" },
    max: { type: String, default: "0" }
  },
  image: {
    title: String,
    description: String,
    url: [String],
  },
  status: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  subtasks: [recursiveSubtaskSchema],
}, { _id: false });

// Stage Schema
const stageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedMember: String,
  tasks: [taskSchema],
}, { _id: false });

// Main Task Document (Title)
const taskDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedEquipment: [String],
  stages: [stageSchema],
}, { timestamps: true });
delete mongoose.models.Task
export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);
