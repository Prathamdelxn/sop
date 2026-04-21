import mongoose from "mongoose";

const superadminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true },
  logo: { type: String, required: true },
  username: { type: String, required: true },
  address: { type: String, required: true },
  companyId: { type: String, required: true },
  features: { type: [String], default: [] },
  workerRole: [
    {
      title: { type: String },
      task: [String],
    }
  ],
  role: { type: String, default: 'company-admin' }
}, { timestamps: true });

// Compound Unique Indices for Company Scoping
superadminSchema.index(
  { companyId: 1, email: 1 }, 
  { unique: true, partialFilterExpression: { email: { $type: "string" } } }
);
superadminSchema.index({ companyId: 1, username: 1 }, { unique: true });

delete mongoose.models.SuperAdmin;
export default mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", superadminSchema);

