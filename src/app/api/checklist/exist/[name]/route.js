// /app/api/checklist/exists/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db"; // your DB connection helper
import Prototype from "@/model/Task"; // adjust to your model path

export async function GET(request,{params}) {
  
 const {name}=params;

  if (!name) {
    return NextResponse.json({ exists: false });
  }

  await dbConnect();

  const existing = await Prototype.findOne({ name });

  return NextResponse.json({ exists: !!existing });
}
