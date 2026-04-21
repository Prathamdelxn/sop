import mongoose from "mongoose";

const durationSchema = new mongoose.Schema({
  hours: { type: Number, default: 0 },
  minutes: { type: Number, default: 0 },
  seconds: { type: Number, default: 0 }
}, { _id: false });

const imageAttachmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String,
  public_id: String,
  size: Number,
  isUploading: { type: Boolean, default: false }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId() 
  },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  minDuration: { type: Number, default: 0 },
  maxDuration: { type: Number, default: 0 },
  minTime: { type: durationSchema, default: () => ({}) },
  maxTime: { type: durationSchema, default: () => ({}) },
  attachedImages: { type: [imageAttachmentSchema], default: [] },
  imageTitle: { type: String, default: "" },
  imageDescription: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  subtasks: [], 
  level: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

taskSchema.add({ subtasks: [taskSchema] });

const stageSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId() 
  },
  name: { type: String, required: true },
  tasks: { type: [taskSchema], default: [] },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const prototypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: String },
  departmentName: { type: String },
  documentNo: { type: String },
  effectiveDate: { type: String },
  version: { type: String },
  userId: { type: String },
  stages: { type: [stageSchema], default: [] },
  visualRepresentationEnabled: { type: Boolean, default: false },
  status: { type: String },
  rejectionReason: { type: String, default: null },
  reviews: [{
    reviewerId: { type: String },
    reviewerName: { type: String },
    reviewerRole: { type: String },
    status: { type: String },
    comments: { type: String },
    reviewDate: { type: String }
  }],
  approvers: [{
    approverId: { type: String },
    approverName: { type: String },
    approverRole: { type: String },
    status: { type: String },
    comments: { type: String },
    approvalDate: { type: String }
  }],
}, { timestamps: true });

export default mongoose.models.Prototype || mongoose.model("Prototype", prototypeSchema);
