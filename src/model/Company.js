import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  logo: { type: String },
  companyId: { type: String, required: true, unique: true }, // slug like 'company-a'
  code: { type: String, default: "" }, // Short code for batch numbering (e.g., "KR")
  enabledFeatures: {
    type: [String],
    enum: ["CHECKLIST", "PHARMA-ELOGBOOK", "NON-PHARMA-ELOGBOOK", "OPERATION"],
    default: ["CHECKLIST"]
  },
  status: { type: String, enum: ["Active", "InActive"], default: "Active" },
  checklists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Checklist' }],
  equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  prototypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prototype' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewAssignment' }],
}, { timestamps: true });

delete mongoose.models.Company;
export default mongoose.models.Company || mongoose.model("Company", companySchema);
