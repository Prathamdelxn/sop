import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type: String, },
   location:{ type: String, },
    phone:{ type: String, },
   status:{type:String},
}, { timestamps: true });

export default mongoose.models.Operator || mongoose.model("Operator", operatorSchema);
