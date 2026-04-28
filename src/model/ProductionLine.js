import mongoose from "mongoose";

const productionLineSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", required: true },
  lineNumber: { type: Number, required: true },  // 1, 2, 3... 10
  name: { type: String, default: "" },            // Optional: "CED Line 1"
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productionLineSchema.index({ plantId: 1, lineNumber: 1 }, { unique: true });

export default mongoose.models.ProductionLine || mongoose.model("ProductionLine", productionLineSchema);
