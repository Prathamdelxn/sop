import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username:{type:String},
  companyId:{type:String},
  status:{type:String},
  phone:{type:String,required: true},
  task:[String],
location: {
  type: String,

},
  role:{ type: String, required: true },
}, { timestamps: true });0
delete mongoose.models.User;
export default mongoose.models.User || mongoose.model("User", userSchema);
