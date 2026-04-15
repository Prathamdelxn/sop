import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";
import ElogbookMasterData from "@/model/ElogbookMasterData";

export const dynamic = "force-dynamic";

// GET — fetch all master data for a specific company
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "companyId required" }, { status: 400 });
    }

    // Get the tenant-specific model
    const TenantMasterModel = ElogbookMasterData; 
    const __tenantCompanyId = companyId;
    
    const records = await TenantMasterModel.find({ companyId: __tenantCompanyId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("ElogbookMasterData GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — create new master data record (isolated by tenant)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      companyId, customerName, subCompany, partName,
      coatingRequirements, standardCycleTime, standardVoltage,
      standardTemperature, partsPerBasket, basketCount,
    } = body;

    if (!companyId || !customerName || !partName || !standardCycleTime || !partsPerBasket) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const TenantMasterModel = ElogbookMasterData; 
    const __tenantCompanyId = companyId;

    const record = await TenantMasterModel.create({
      companyId,
      customerName,
      subCompany,
      partName,
      coatingRequirements,
      standardCycleTime,
      standardVoltage,
      standardTemperature,
      partsPerBasket,
      basketCount: basketCount || 3,
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("ElogbookMasterData POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

