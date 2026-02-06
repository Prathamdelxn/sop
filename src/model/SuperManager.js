import mongoose from "mongoose";

const superManagerSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type: String, default:"super-manager" },
}, { timestamps: true });

export default mongoose.models.superManager || mongoose.model("superManager", superManagerSchema);
