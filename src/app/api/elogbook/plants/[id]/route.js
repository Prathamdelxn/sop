import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Plant from "@/model/Plant";

// PUT — update a plant
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await req.json();
    const { name, code, address, city, state, country } = body;

    const plant = await Plant.findById(id);
    if (!plant) {
      return NextResponse.json({ success: false, message: "Plant not found" }, { status: 404 });
    }

    // If code is changing, check for duplicates
    if (code && code.toUpperCase() !== plant.code) {
      const existing = await Plant.findOne({ companyId: plant.companyId, code: code.toUpperCase(), _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({
          success: false,
          message: `A plant with code "${code.toUpperCase()}" already exists.`
        }, { status: 409 });
      }
    }

    if (name !== undefined) plant.name = name;
    if (code !== undefined) plant.code = code.toUpperCase();
    if (address !== undefined) plant.address = address;
    if (city !== undefined) plant.city = city;
    if (state !== undefined) plant.state = state;
    if (country !== undefined) plant.country = country;

    await plant.save();
    return NextResponse.json({ success: true, data: plant });
  } catch (error) {
    console.error("Plant PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE — soft-delete a plant
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const plant = await Plant.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!plant) {
      return NextResponse.json({ success: false, message: "Plant not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: plant });
  } catch (error) {
    console.error("Plant DELETE error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
