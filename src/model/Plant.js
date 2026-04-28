import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  name: { type: String, required: true },        // "Mumbai Plant", "Ahmedabad Plant"
  code: { type: String, required: true },         // Short code: "MUM", "AHM" — used in batch IDs
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "India" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

plantSchema.index({ companyId: 1, code: 1 }, { unique: true });

export default mongoose.models.Plant || mongoose.model("Plant", plantSchema);
