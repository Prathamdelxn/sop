// // import mongoose from "mongoose";

// // // ✅ Subtask Schema (With image object)
// // const subtaskSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   description: String,
// //   image: {
// //     title: String,
// //     description: String,
// //     url: String,
// //   },
// //   status: { type: Boolean, default: false },
// //   completed: { type: Boolean, default: false },
// // }, { _id: false });

// // // ✅ Task Schema (Supports multiple images & min/max duration)
// // const taskSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   description: String,
// //   image: {
// //     title: String,
// //     description: String,
// //     url: [String],  // <-- array of image URLs
// //   },
// //   duration: {
// //     min: { type: Number, default: 0 },
// //     max: { type: Number, default: 0 },
// //   },
// //   status: { type: Boolean, default: false },
// //   completed: { type: Boolean, default: false },
// //   subtasks: [subtaskSchema],
// // }, { _id: false });




// // // ✅ Stage Schema (No description)
// // const stageSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   tasks: [taskSchema],
// // }, { _id: false });

// // // ✅ Main Task Document Schema
// // const taskDocumentSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   stages: [stageSchema],
// // }, { timestamps: true });
// // delete mongoose.models.Task
// // export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);
// import mongoose from "mongoose";

// // Recursive Subtask Schema (same as Task)
// const recursiveSubtaskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   duration: {
//     min: { type: String, default: "0" },
//     max: { type: String, default: "0" }
//   },
//   image: {
//     title: String,
//     description: String,
//     url: [String],
//   },
//   status: { type: Boolean, default: false },
//   completed: { type: Boolean, default: false },
//   subtasks: [] // placeholder, will be replaced recursively
// }, { _id: false });

// // Assign self-recursion to enable infinite nesting
// recursiveSubtaskSchema.add({
//   subtasks: [recursiveSubtaskSchema]
// });

// // Task Schema (same structure as recursiveSubtaskSchema)
// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   duration: {
//     min: { type: String, default: "0" },
//     max: { type: String, default: "0" }
//   },
//   image: {
//     title: String,
//     description: String,
//     url: [String],
//   },
//   status: { type: Boolean, default: false },
//   completed: { type: Boolean, default: false },
//   subtasks: [recursiveSubtaskSchema],
// }, { _id: false });

// // Stage Schema
// const stageSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   assignedMember: String,
//   tasks: [taskSchema],
// }, { _id: false });

// // Main Task Document (Title)
// const taskDocumentSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   assignedEquipment: [String],
//   stages: [stageSchema],
// }, { timestamps: true });
// delete mongoose.models.Task
// export default mongoose.models.Task || mongoose.model("Task", taskDocumentSchema);


// import mongoose from "mongoose";

// // Duration Sub-Schema
// const durationSchema = new mongoose.Schema({
//   hours: { type: Number, default: 0 },
//   minutes: { type: Number, default: 10 },
//   seconds: { type: Number, default: 0 }
// }, { _id: false });

// // Image Attachment Sub-Schema
// const imageAttachmentSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   url: { type: String, required: true },
//   public_id: { type: String, required: true },
//   size: Number,
//   isUploading: { type: Boolean, default: false }
// }, { _id: false });

// // Recursive Task Schema for Subtasks
// const taskSchema = new mongoose.Schema({
//   id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
//   title: { type: String, required: true },
//   description: String,
//   // Duration fields (both formats)
//   minDuration: Number, // Total minutes
//   maxDuration: Number, // Total minutes
//   minTime: durationSchema,
//   maxTime: durationSchema,
//   // Image attachments
//   attachedImages: [imageAttachmentSchema],
//   imageTitle: String,
//   imageDescription: String,
//   // Subtasks (recursive)
//   subtasks: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Task'
//   }],
//   level: { type: Number, default: 0 },
//   order: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// }, { _id: false });

// // Stage Schema
// const stageSchema = new mongoose.Schema({
//   id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
//   name: { type: String, required: true },
//   tasks: [taskSchema],
//   order: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// }, { _id: false });

// // Main Prototype Schema
// const prototypeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   stages: [stageSchema],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for better query performance
// // prototypeSchema.index({ name: 'text', 'stages.name': 'text', 'stages.tasks.title': 'text' });

// // Delete existing model if it exists
// delete mongoose.models.Prototype;

// // Create and export the model
// export default mongoose.models.Prototype || mongoose.model("Prototype", prototypeSchema);


// import mongoose from "mongoose";

// // Duration Sub-Schema
// const durationSchema = new mongoose.Schema({
//   hours: { type: Number, default: 0 },
//   minutes: { type: Number, default: 10 },
//   seconds: { type: Number, default: 0 }
// }, { _id: false });

// // Image Attachment Sub-Schema
// const imageAttachmentSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   url: { type: String, },
//   public_id: { type: String },
//   size: Number,
//   isUploading: { type: Boolean, default: false }
// }, { _id: false });

// // Task Schema
// const taskSchema = new mongoose.Schema({
//   _id: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     default: () => new mongoose.Types.ObjectId() 
//   },
//   title: { type: String, },
//   description: String,
//   // Duration fields (both formats)
//   minDuration: Number, // Total minutes
//   maxDuration: Number, // Total minutes
//   minTime: durationSchema,
//   maxTime: durationSchema,
//   // Image attachments
//   attachedImages: [imageAttachmentSchema],
//   imageTitle: String,
//   imageDescription: String,
//   // Subtasks (using ObjectId references)
//   subtasks: [taskSchema],
//   level: { type: Number, default: 0 },
//   order: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// }, { _id: true }); // Enable _id for tasks

// // Stage Schema
// const stageSchema = new mongoose.Schema({
//   _id: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     default: () => new mongoose.Types.ObjectId() 
//   },
//   name: { type: String, required: true },
//   tasks: [taskSchema],
//   order: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// }, { _id: true }); // Enable _id for stages

// // Main Prototype Schema
// const prototypeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   stages: [stageSchema],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, { 
//   timestamps: true,
//   toJSON: { 
//     virtuals: true,
//     transform: function(doc, ret) {
//       delete ret.__v;
//       return ret;
//     }
//   },
//   toObject: { 
//     virtuals: true,
//     transform: function(doc, ret) {
//       delete ret.__v;
//       return ret;
//     }
//   }
// });

// // Indexes for better query performance
// // prototypeSchema.index({ name: 'text' });
// // prototypeSchema.index({ 'stages.name': 'text' });
// // prototypeSchema.index({ 'stages.tasks.title': 'text' });

// // Middleware to handle ID conversion before saving
// prototypeSchema.pre('save', function(next) {
//   // Convert numeric IDs to ObjectId if they exist
//   const convertIds = (obj) => {
//     if (obj.id && typeof obj.id === 'number') {
//       obj._id = new mongoose.Types.ObjectId();
//       delete obj.id;
//     }
//     return obj;
//   };

//   if (this.stages && Array.isArray(this.stages)) {
//     this.stages = this.stages.map(stage => {
//       stage = convertIds(stage);
//       if (stage.tasks && Array.isArray(stage.tasks)) {
//         stage.tasks = stage.tasks.map(task => {
//           task = convertIds(task);
//           if (task.subtasks && Array.isArray(task.subtasks)) {
//             task.subtasks = task.subtasks.map(subtask => convertIds(subtask));
//           }
//           return task;
//         });
//       }
//       return stage;
//     });
//   }
//   next();
// });

// // Delete existing model if it exists
// delete mongoose.models.Prototype;

// // Create and export the model
// export default mongoose.models.Prototype || mongoose.model("Prototype", prototypeSchema);




import mongoose from "mongoose";

// Duration Sub-Schema
const durationSchema = new mongoose.Schema({
  hours: { type: Number, default: 0 },
  minutes: { type: Number, default: 10 },
  seconds: { type: Number, default: 0 }
}, { _id: false });

// Image Attachment Sub-Schema
const imageAttachmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String,
  public_id: String,
  size: Number,
  isUploading: { type: Boolean, default: false }
}, { _id: false });

// ✅ Define a standalone subtask schema (no recursive subtasks to avoid infinite nesting)
const subtaskSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId() 
  },
  title: String,
  description: String,
  minDuration: Number,
  maxDuration: Number,
  minTime: durationSchema,
  maxTime: durationSchema,
  attachedImages: [imageAttachmentSchema],
  imageTitle: String,
  imageDescription: String,
  imagePublicId: String,
  level: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// ✅ Main Task Schema using embedded subtasks
const taskSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId() 
  },
  title: String,
  description: String,
  minDuration: Number,
  maxDuration: Number,
  minTime: durationSchema,
  maxTime: durationSchema,
  attachedImages: [imageAttachmentSchema],
  imageTitle: String,
  imageDescription: String,
  imagePublicId: String,
  // ✅ Use the subtaskSchema here instead of recursive taskSchema
  subtasks: [subtaskSchema],
  level: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// Stage Schema
const stageSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId() 
  },
  name: { type: String, required: true },
  tasks: [taskSchema],
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// Main Prototype Schema
const prototypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId:{type:String},
  userId:{type:String},
  stages: [stageSchema],
  status:{type:String},
   rejectionReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Middleware to convert numeric `id` to ObjectId before saving
prototypeSchema.pre('save', function(next) {
  const convertIds = (obj) => {
    if (obj.id && typeof obj.id === 'number') {
      obj._id = new mongoose.Types.ObjectId();
      delete obj.id;
    }
    return obj;
  };

  if (this.stages && Array.isArray(this.stages)) {
    this.stages = this.stages.map(stage => {
      stage = convertIds(stage);
      if (stage.tasks && Array.isArray(stage.tasks)) {
        stage.tasks = stage.tasks.map(task => {
          task = convertIds(task);
          if (task.subtasks && Array.isArray(task.subtasks)) {
            task.subtasks = task.subtasks.map(subtask => convertIds(subtask));
          }
          return task;
        });
      }
      return stage;
    });
  }

  next();
});

// Delete existing model if it exists (for hot reload)
delete mongoose.models.Prototype;

// Create and export the model
export default mongoose.models.Prototype || mongoose.model("Prototype", prototypeSchema);
