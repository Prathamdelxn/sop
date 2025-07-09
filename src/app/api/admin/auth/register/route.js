import dbConnect from "@/utils/db";
import Admin from "@/model/Admin";
import Supervisor from "@/model/Supervisor";
import Operator from "@/model/Operator";
import QA from "@/model/QA";
import UserFacilityAdmin from "@/model/FacilityAdmin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import FacilityAdmin from "@/model/FacilityAdmin";

const validRoles = [
  "admin",
  "facility-admin",
  "user-facility-admin",
  "supervisor",
  "operator",
  "QA"
];

export async function POST(req) {
  await dbConnect();
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // ✅ Check if email already exists in any role schema
  const checkEmailExists = async () => {
    const models = [Admin, FacilityAdmin, Supervisor, Operator, QA, UserFacilityAdmin];
    for (const model of models) {
      const user = await model.findOne({ email });
      if (user) return true;
    }
    return false;
  };

  const emailExists = await checkEmailExists();

  if (emailExists) {
    return NextResponse.json({ error: "Email already registered in another role" }, { status: 400 });
  }

  // ✅ Save in appropriate model
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser;

  switch (role) {
    case "admin":
    case "facility-admin":
      newUser = await Admin.create({ name, email, password: hashedPassword, role });
      break;
    case "user-facility-admin":
      newUser = await UserFacilityAdmin.create({ name, email, password: hashedPassword, role });
      break;
    case "supervisor":
      newUser = await Supervisor.create({ name, email, password: hashedPassword, role });
      break;
    case "operator":
      newUser = await Operator.create({ name, email, password: hashedPassword, role });
      break;
    case "QA":
      newUser = await QA.create({ name, email, password: hashedPassword, role });
      break;
    default:
      return NextResponse.json({ error: "Unhandled role" }, { status: 400 });
  }

  return NextResponse.json({ message: `${role} created`, id: newUser._id }, { status: 201 });
}
