import dbConnect from "@/utils/db";
import { getTenantModel } from "@/utils/tenantDb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Handle CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// GET all Prototypes for a specific company
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Get dynamic model for this company
    const PrototypeModel = getTenantModel("Task", companyId);

    const titles = await PrototypeModel.find().sort({ createdAt: -1 });

    const response = NextResponse.json(
      { message: "Prototypes fetched successfully", data: titles },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("❌ Error fetching prototypes:", error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
