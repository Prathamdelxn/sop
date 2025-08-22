// // models/Assignment.js
// import mongoose from 'mongoose';

// const assignmentSchema = new mongoose.Schema({
//   generatedId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   equipment: {
//     type: Object, // store full equipment object
//     required: true,
//   },
//   prototype: {
//     type: Object, // store full prototype object
//     required: true,
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// delete mongoose.models.Assignment;
// export default mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);


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
