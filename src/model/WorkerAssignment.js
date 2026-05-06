import mongoose from "mongoose";

const workerAssignmentSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", required: true },
  lineId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductionLine", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  date: { type: Date, required: true }, // The date of assignment (normalized to midnight)
  status: {
    type: String,
    enum: ["active", "released", "completed"],
    default: "active",
  },
}, { timestamps: true });

// Quick lookup for a worker's active assignments
workerAssignmentSchema.index({ companyId: 1, userId: 1, date: 1, status: 1 });

// Quick lookup for all assignments on a line/date
workerAssignmentSchema.index({ companyId: 1, plantId: 1, date: 1 });

export default mongoose.models.WorkerAssignment ||
  mongoose.model("WorkerAssignment", workerAssignmentSchema);
