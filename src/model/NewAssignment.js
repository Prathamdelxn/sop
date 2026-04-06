

import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  generatedId: {
    type: String,
    required: true,
    unique: true,
  },
 equipment: {
    type: Object, // store full equipment object
    required: true,
  },
  prototypeData: {
  type:Object,
    required: true,
  },
  companyId:{type:String},
  userId:{type:String},
  status:{type:String , default:"InProgress"},
  rejectionReason:{type:String},
  // Task Review fields
  reviewStatus: { type: String, default: null }, // "Pending Review", "Approved", "Rework Required"
  reviewNotes: [{
    taskPath: { type: String },        // e.g., "stages.0.tasks.1" or "stages.0.tasks.1.subtasks.0"
    taskTitle: { type: String },
    note: { type: String },
    reopened: { type: Boolean, default: false },
    reviewedBy: {
      id: { type: String },
      name: { type: String }
    },
    reviewedAt: { type: Date, default: Date.now }
  }],
  reviewedBy: {
    id: { type: String },
    name: { type: String }
  },
  reviewedAt: { type: Date },
  visualReviewStatus: { type: String, default: null }, // "Pending Visual Review", "Clean", "Not Clean"
  visualReviewNotes: [{
    taskPath: { type: String },
    taskTitle: { type: String },
    note: { type: String },
    reviewedBy: {
      id: { type: String },
      name: { type: String }
    },
    reviewedAt: { type: Date, default: Date.now }
  }],
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

delete mongoose.models.NewAssignment
export default mongoose.models.NewAssignment || mongoose.model('NewAssignment', assignmentSchema);
