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

// ✅ Subtask Schema (With image object)
const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    title: String,
    description: String,
    url: String,
  },
  status: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
}, { _id: false });

// ✅ Task Schema (Supports multiple images & min/max duration)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    title: String,
    description: String,
    url: [String],  // <-- array of image URLs
  },
  duration: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  status: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  subtasks: [subtaskSchema],
}, { _id: false });

// ✅ Stage Schema (No description)
const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [taskSchema],
}, { _id: false });

// ✅ Main Task Document Schema
const taskDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sopNumber: { 
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^PRO-MOD-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid SOP number format (PRO-MOD-XX)`
    }
  },
  stages: [stageSchema],
}, { timestamps: true });

// Clear existing model if it exists
delete mongoose.models.Task;

// Create and export the model
export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);