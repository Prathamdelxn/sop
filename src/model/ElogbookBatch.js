import mongoose from "mongoose";

const elogbookBatchSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  masterDataId: { type: mongoose.Schema.Types.ObjectId, ref: "ElogbookMasterData", required: true },
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

export default mongoose.models.ElogbookBatch || mongoose.model("ElogbookBatch", elogbookBatchSchema);
