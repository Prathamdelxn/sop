import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  logo: { type: String },
  companyId: { type: String, required: true, unique: true }, // slug like 'company-a'
  enabledFeatures: {
    type: [String],
    enum: ["CHECKLIST", "PHARMA-ELOGBOOK", "NON-PHARMA-ELOGBOOK", "OPERATION"],
    default: ["CHECKLIST"]
  },
  status: { type: String, enum: ["Active", "InActive"], default: "Active" },
}, { timestamps: true });

delete mongoose.models.Company;
export default mongoose.models.Company || mongoose.model("Company", companySchema);
