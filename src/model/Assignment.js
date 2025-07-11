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

// Sub-schema for equipment


// Sub-schema for prototype
const prototypeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  stages: Array, // you can define more structure here if needed
  createdAt: Date,
  updatedAt: Date,
  id: String,
}, { _id: false });

// Main Assignment Schema
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
  prototype: {
    type: String,
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export
delete mongoose.models.Assignment;
export default mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
