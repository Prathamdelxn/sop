import mongoose from "mongoose";
 

 
// ---------------- Stage Schema ----------------
const checklistStageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description :{type: String , required:true},
  galleryDescription:{type:String},
 minTime: {type:String},
 maxTime: {type:String},
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  stages: [{
    title: { type: String },
    tasks:[checklistStageSchema]
  }], // ✅ reference StageSchema, not itself

 defaultStage: {
  title: { type: String, required: true },
  tasks: [checklistStageSchema]
},

  visualRepresntation:[
    {
      checkPoint:{
        title:{type:String},
        images:[Object]
      },
      cleaningStatus:{type:String,default:"Clean"},
      production:{type:String},
      qa:{type:String}
    }
  ]
});
 
delete mongoose.models.Checklist;
// ✅ Export model
export default mongoose.models.Checklist ||
  mongoose.model("Checklist", checklistSchema);
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 