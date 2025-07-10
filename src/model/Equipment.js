// models/Equipment.js
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
  status:{type:String,default:'pending'},
  assignedPrototype:{type:String}
}, {
  timestamps: true,
});

export default mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
