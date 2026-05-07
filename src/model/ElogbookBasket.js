import mongoose from "mongoose";

const stoppageSchema = new mongoose.Schema({
  stopTime: { type: Date, required: true },
  restartTime: { type: Date, default: null },
  reason: { type: String, default: "" },
  lostMinutes: { type: Number, default: 0 }, // auto-calculated
}, { _id: true });

const elogbookBasketSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", default: null },
  lineId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductionLine", default: null },
  masterDataId: { type: mongoose.Schema.Types.ObjectId, ref: "ElogbookMasterData", required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "ElogbookBatch", default: null },
  basketNumber: { type: Number, required: true },
  barcode: { type: String, default: "" }, // scanned barcode value
  date: { type: Date, default: Date.now },

  // Lifecycle timestamps
  startTime: { type: Date, default: null },
  startUser: { type: String, default: "" },
  endTime: { type: Date, default: null },
  endUser: { type: String, default: "" },

  // Stoppages (multiple stop/restart pairs)
  stoppages: [stoppageSchema],

  // Calculated fields
  actualCycleTime: { type: Number, default: 0 }, // minutes
  totalLostTime: { type: Number, default: 0 }, // minutes

  // Execution Reason (for early/late completion)
  executionReason: { type: String, default: "" },

  // Additional operators
  additionalUsers: [{ type: String }], // manually entered names

  status: {
    type: String,
    enum: ["pending", "in-progress", "stopped", "completed", "pending-qc", "qc-done"],
    default: "pending",
  },
}, { timestamps: true });

// Ensure model is registered
let ElogbookBasket;

try {
  // Try to get existing model
  ElogbookBasket = mongoose.model('ElogbookBasket');
} catch (error) {
  // If doesn't exist, create it
  ElogbookBasket = mongoose.model('ElogbookBasket', elogbookBasketSchema);
}

export default ElogbookBasket;