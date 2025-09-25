import mongoose from "mongoose";
 
// ---------------- Duration Schema ----------------
const checklistDurationSchema = new mongoose.Schema({
  hours: { type: Number, default: 0 },
  minutes: { type: Number, default: 0 },
  seconds: { type: Number, default: 0 },
});
 
// ---------------- Stage Schema ----------------
const checklistStageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description :{type: String , required:true},
  galleryDescription:{type:String},
 minTime: {String},
 maxTime: {String},
  galleryTitle:{type:String},

   
 
  images: [],
  subtasks: [], // recursion will be added later
});
 
// ✅ Add recursion AFTER definition
checklistStageSchema.add({ subtasks: [checklistStageSchema] });
 
// ---------------- Checklist Schema ----------------
const checklistSchema = new mongoose.Schema({
  name: { type: String, required: true ,unique: true },
  department: { type: String, required: true },
  version: { type: String, required: true },
  companyId: { type: String },
  qms_number: { type: String, required: true },
  documentNumber: { type: String, required: true },
  status:{type:String,default:"InProgress"},
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  stages: [{
    title:{String},
    tasks:[checklistStageSchema]
  }], // ✅ reference StageSchema, not itself
});
 
delete mongoose.models.Checklist;
// ✅ Export model
export default mongoose.models.Checklist ||
  mongoose.model("Checklist", checklistSchema);
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 