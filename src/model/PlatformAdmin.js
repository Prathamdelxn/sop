import mongoose from "mongoose";

const platformAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "platform-admin" },
  status: { type: String, default: "active" },
}, { timestamps: true });

export default mongoose.models.PlatformAdmin || mongoose.model("PlatformAdmin", platformAdminSchema);
