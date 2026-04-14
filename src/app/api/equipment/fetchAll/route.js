import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import { getTenantModel } from '@/utils/tenantDb';

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ success: false, message: "Company ID is required" }, { status: 400 });
    }

    // Get the dynamic Equipment model for this company
    const EquipmentModel = getTenantModel("Equipment", companyId);

    const equipmentList = await EquipmentModel.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: equipmentList }, { status: 200 });
  } catch (err) {
    console.error('Error fetching equipment:', err);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
