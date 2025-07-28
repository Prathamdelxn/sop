import mongoose from "mongoose";

const superadminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:{type:String,required:true},
  status:{type:String,required:true},
  logo:{type:String,required:true},
  username:{type:String,required:true},
  address:{ type: String, required: true },
  workerRole:[
    {
        title:{type:String},
        task:[String],
    }

  ],
  role:{type:String, default:'company-admin'}
}, { timestamps: true });
delete mongoose.models.SuperAdmin;
export default mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", superadminSchema);
