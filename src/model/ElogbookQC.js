import mongoose from "mongoose";

const elogbookQCSchema = new mongoose.Schema({
  basketId: { type: mongoose.Schema.Types.ObjectId, ref: "ElogbookBasket", required: true },
  companyId: { type: String, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", default: null },
  lineId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductionLine", default: null },
  batchNumber: { type: String, default: "" }, // Denormalized for fast reporting
  inspectorName: { type: String, required: true },
  inspectionDate: { type: Date, default: Date.now },

  // Quantities (Basket Totals)
  inspectedQuantity: { type: Number, required: true },
  goodQuantity: { type: Number, default: 0 }, 
  reworkQuantity: { type: Number, default: 0 },

  // Per-item inspection details
  items: [{
    masterDataId: { type: mongoose.Schema.Types.ObjectId, ref: "ElogbookMasterData" },
    inspectedQuantity: { type: Number, default: 0 },
    goodQuantity: { type: Number, default: 0 },
    reworkQuantity: { type: Number, default: 0 },
    defects: {
      watermark1: { type: Number, default: 0 },
      watermark2: { type: Number, default: 0 },
      maskingProblem: { type: Number, default: 0 },
      scratchMark: { type: Number, default: 0 },
      pvcPeelOff: { type: Number, default: 0 },
    },
    reworkStatus: {
      type: String,
      enum: ["none", "pending", "completed"],
      default: "none",
    },
    reworkPassedQuantity: { type: Number, default: 0 },
    permanentRejections: { type: Number, default: 0 },
    finalGoodQuantity: { type: Number, default: 0 },
  }],

  // 5 specific defect types (Legacy/Basket Total)
  defects: {
    watermark1: { type: Number, default: 0 },
    watermark2: { type: Number, default: 0 },
    maskingProblem: { type: Number, default: 0 },
    scratchMark: { type: Number, default: 0 },
    pvcPeelOff: { type: Number, default: 0 },
  },

  // Rework flow (Legacy/Basket Total)
  reworkStatus: {
    type: String,
    enum: ["none", "pending", "completed"],
    default: "none",
  },
  reworkPassedQuantity: { type: Number, default: 0 },
  permanentRejections: { type: Number, default: 0 },
  finalGoodQuantity: { type: Number, default: 0 }, 

  remarks: { type: String, default: "" },
}, { timestamps: true });

// delete mongoose.models.ElogbookQC;
export default mongoose.models.ElogbookQC || mongoose.model("ElogbookQC", elogbookQCSchema);
