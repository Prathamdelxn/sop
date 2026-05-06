import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String },
  password: { type: String, required: true },
  username:{type:String},
  companyId:{type:String},
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", default: null },
  status:{type:String},
  phone:{type:String,required: true},
  task:[String],
location: {
  type: String,

},
  role:{ type: String, required: true },
}, { timestamps: true });

// Compound Unique Indices for Company Scoping
userSchema.index(
  { companyId: 1, email: 1 }, 
  { unique: true, sparse: true, partialFilterExpression: { email: { $type: "string" } } }
);
userSchema.index({ companyId: 1, username: 1 }, { unique: true });
userSchema.index(
  { companyId: 1, phone: 1 }, 
  { unique: true, partialFilterExpression: { phone: { $type: "string" } } }
);

delete mongoose.models.User;
export default mongoose.models.User || mongoose.model("User", userSchema);
