// // models/Equipment.js
// import mongoose from 'mongoose';

// const equipmentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   manufacturer: {
//     type: String,
//   },
//   supplier: {
//     type: String,
//   },
//   model: {
//     type: String,
//   },
//   serial: {
//     type: String,
//   },
//   assetTag: {
//     type: String,
//     unique: true, // assuming assetTag is unique
//   },
//   companyId:{type:String},
//   userId:{type:String},
//   barcode:{type:String,default:''},
//   status:{type:String,default:'InProgress'},
//   rejectionReason:{type:String},
//   assignedPrototype:{type:String}
// }, {
//   timestamps: true,
// });
// delete mongoose.models.Equipment;
// export default mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
//src/model/Equipment.js


import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
  },
  supplier: {
    type: String,
  },
  model: {
    type: String,
  },
  serial: {
    type: String,
  },
  assetTag: {
    type: String,
    unique: true, // assuming assetTag is unique
  },
  qmsNumber: {
    type: String,
  },
  poNumber: {
    type: String,
  },
  qualificationDoneDate: {
    type: Date,
    default: null
  },
  qualificationDueDate: {
    type: Date,
    default: null
  },
  equipmentId: {
    type: String,
  },
  companyId:{type:String},
  approver:{
    approverId:{type:String},
    approverName:{type:String}
  },
  userId:{type:String},
  barcode:{type:String,default:''},
  status:{type:String,default:'InProgress'},
  rejectionReason:{type:String},
  assignedPrototype:{type:String}
}, {
  timestamps: true,
});
delete mongoose.models.Equipment;
export default mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);