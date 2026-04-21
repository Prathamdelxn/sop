import mongoose from "mongoose";

// --- Shared Sub-Schemas (Checklist) ---
const checklistStageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  galleryDescription: { type: String },
  minTime: { type: String },
  maxTime: { type: String },
  galleryTitle: { type: String },
  images: [],
  parameter: {
    label: { type: String },
    min: { type: Number },
    max: { type: Number }
  },
  addStop: { type: Boolean, default: false },
  subtasks: [],
});
checklistStageSchema.add({ subtasks: [checklistStageSchema] });

// --- Checklist Schema ---
export const checklistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  version: { type: String, required: true },
  companyId: { type: String },
  qms_number: { type: String, required: true },
  documentNumber: { type: String, required: true },
  status: { type: String, default: "InProgress" },
  rejectionReason: { type: String, default: null },
  userId: { type: String },
  reviews: [{
    reviewerId: { type: String },
    reviewerName: { type: String },
    reviewerRole: { type: String },
    status: { type: String },
    comments: { type: String },
    reviewDate: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
  approvers: [{
    approverId: { type: String },
    approverName: { type: String },
    approverRole: { type: String },
    status: { type: String },
    comments: { type: String },
    approvalDate: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
  stages: [{
    title: { type: String },
    tasks: [checklistStageSchema]
  }],
  defaultStage: {
    title: { type: String, required: true },
    tasks: [checklistStageSchema]
  },
  visualRepresntation: [
    {
      checkPoint: {
        title: { type: String },
        images: [Object]
      },
      cleaningStatus: { type: String, default: "Clean" },
      production: { type: String },
      qa: { type: String }
    }
  ],
  visualRepresentationEnabled: { type: Boolean, default: false },
}, { timestamps: true });

// --- E-Logbook Master Data Schema ---
export const elogbookMasterDataSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  customerName: { type: String, required: true },
  subCompany: { type: String, default: "" },
  partName: { type: String, required: true },
  coatingRequirements: { type: String, default: "" },
  standardCycleTime: { type: Number, required: true },
  standardVoltage: { type: Number, default: 0 },
  standardTemperature: { type: Number, default: 0 },
  partsPerBasket: { type: Number, required: true },
  basketCount: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// --- Prototype/Task Schema (Modular) ---
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
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  minDuration: { type: Number, default: 0 },
  maxDuration: { type: Number, default: 0 },
  minTime: { type: durationSchema, default: () => ({}) },
  maxTime: { type: durationSchema, default: () => ({}) },
  attachedImages: { type: [imageAttachmentSchema], default: [] },
  subtasks: [],
  order: { type: Number, default: 0 },
}, { _id: true });
taskSchema.add({ subtasks: [taskSchema] });

const stageSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  tasks: { type: [taskSchema], default: [] },
  order: { type: Number, default: 0 },
}, { _id: true });

export const prototypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: String },
  departmentName: { type: String },
  documentNo: { type: String },
  version: { type: String },
  stages: { type: [stageSchema], default: [] },
  status: { type: String },
}, { timestamps: true });

// --- Equipment Schema ---
export const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  manufacturer: { type: String },
  supplier: { type: String },
  model: { type: String },
  serial: { type: String },
  preventiveMaintenaceDoneDate: { type: String },
  qmsNumber: { type: String },
  preventiveDueDate: { type: String },
  qualificationDoneDate: { type: Date, default: null },
  qualificationDueDate: { type: Date, default: null },
  equipmentId: { type: String },
  companyId: { type: String },
  approver: {
    approverId: { type: String },
    approverName: { type: String },
    approverDate: { type: Date, default: Date.now }
  },
  userId: { type: String },
  remark: { type: String },
  barcode: { type: String, default: '' },
  status: { type: String, default: 'InProgress' },
  rejectionReason: { type: String },
  assignedPrototype: { type: String }
}, { timestamps: true });

// --- New Assignment Schema ---
export const newAssignmentSchema = new mongoose.Schema({
  generatedId: {
    type: String,
    required: true,
    unique: true,
  },
  equipment: {
    type: Object,
    required: true,
  },
  prototypeData: {
    type: Object,
    required: true,
  },
  companyId: { type: String },
  userId: { type: String },
  status: { type: String, default: "InProgress" },
  rejectionReason: { type: String },
  reviewStatus: { type: String, default: null },
  reviewNotes: [{
    taskPath: { type: String },
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
  visualReviewStatus: { type: String, default: null },
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
}, { timestamps: true });
