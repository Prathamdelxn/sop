import mongoose from "mongoose";

const utilityTrackingSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ["started", "completed"], default: "started" },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  
  startUser: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String
  },
  endUser: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String
  },

  // Section A: Operation Times
  operationTimes: {
    burnerStartTime: String,
    hotWaterRinse: String,
    tempReachedTime: String,
    cedLineLoadingStart: String,
    cedLoadingEnd: String,
    totalTime: String,
    cedUnloadingStart: String,
    cedUnloadingStop: String,
    cedLoadingTime: String,
    cedUnloadingTime: String,
    burnerStopTime: String,
    burnerWorkingHrs: String,
  },

  // Section B: Oven and Conveyor Timings
  ovenConveyorTimings: [{
    lineName: String, // CED Line, Powder Coating Line, PVC Line, Powder (2ND Time)
    ovenBurnerStartTime: String,
    tempReachedTime: String,
    conveyorLoadingStart: String, // Can include Hanger No
    conveyorLoadingEnd: String,   // Can include Hanger No
    unloadingStart: String,
    unloadingEnd: String,
    burnerStopTime: String,
    totalBurnerWorkingHrs: String,
    totalLoadingTime: String,
    totalUnloadingTime: String,
  }],

  // Section C: Utility Readings
  utilityReadings: [{
    utilityName: String, // UGVCL, Compressor, Main Panel, PLC Panel, GUJRAT GAS, RAW WATER, RO WATER, DM WATER
    openingReading: String,
    closingReading: String,
    consumption: String,
  }],

  // Section F: PTCED Line Consumptions
  lineConsumptions: [{
    itemName: String,
    batchNo: String,
    mfgDate: String,
    expDate: String,
    consumption: String,
    remarks: String,
  }],

  // Section G: Other Consumables
  otherConsumables: [{
    itemName: String,
    consumption: String,
    remarks: String,
  }],

  operatorDetails: {
    cedOperator: String,
    inspector: String,
  }
}, { timestamps: true });

// Ensure only one record per plant per day
utilityTrackingSchema.index({ companyId: 1, plantId: 1, date: 1 }, { unique: true });

delete mongoose.models.UtilityTracking;
export default mongoose.models.UtilityTracking || mongoose.model("UtilityTracking", utilityTrackingSchema);
