// C:\Users\Admin\Desktop\SOP-Final\sop\src\model\ElogbookMasterData.js

import mongoose from "mongoose";

const elogbookMasterDataSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  customerName: { type: String, required: true },
  country: { type: String, default: "India" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  subCompany: { type: String, default: "" },
  partName: { type: String, required: true },
  coatingRequirements: { type: String, default: "" },
  standardCycleTime: { type: Number, required: true, min: 0 }, // minutes (e.g. 7.45)
  standardVoltage: { type: Number, default: 0, min: 0 }, // volts (e.g. 150)
  maxCurrent: { type: Number, default: 0, min: 0 }, // amperes (e.g. 500)
  standardTemperature: { type: Number, default: 0, min: 0 }, // °C (e.g. 48)
  surfaceAreaPerBasket: { type: Number, default: 0, min: 0 }, // dm² (e.g. 25.5)
  partsPerBasket: { type: Number, required: true, min: 0 }, // e.g. 300–800
  basketCount: { type: Number, default: 3, min: 0 }, // total baskets available
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Optional: Create compound index to prevent duplicate part names for same customer
elogbookMasterDataSchema.index({ companyId: 1, customerName: 1, partName: 1 }, { unique: true });

// delete mongoose.models.ElogbookMasterData;
export default mongoose.models.ElogbookMasterData || mongoose.model("ElogbookMasterData", elogbookMasterDataSchema);