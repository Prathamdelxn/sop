

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
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

delete mongoose.models.NewAssignment
export default mongoose.models.NewAssignment || mongoose.model('NewAssignment', assignmentSchema);
