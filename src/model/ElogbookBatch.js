import mongoose from "mongoose";

const elogbookBatchSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", default: null },
  lineId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductionLine", default: null },
  masterDataId: { type: mongoose.Schema.Types.ObjectId, ref: "ElogbookMasterData", required: true },
  batchNumber: { type: String, default: "" }, // Human-readable: "KR27042026A"
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  startUser: { type: String, default: "" },
  endUser: { type: String, default: "" },
  totalProductionTime: { type: Number, default: 0 }, // in minutes
}, { timestamps: true });

elogbookBatchSchema.index({ companyId: 1, plantId: 1, lineId: 1, status: 1 });

export default mongoose.models.ElogbookBatch || mongoose.model("ElogbookBatch", elogbookBatchSchema);
