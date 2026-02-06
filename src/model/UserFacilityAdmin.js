import mongoose from "mongoose";

const userFacilityAdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String }, 
  location: { type: String },
  phone: { type: String },
  status: { type: String },
}, { timestamps: true });

delete mongoose.models.UserFacilityAdmin; 
export default mongoose.models.UserFacilityAdmin || mongoose.model("UserFacilityAdmin", userFacilityAdminSchema);
