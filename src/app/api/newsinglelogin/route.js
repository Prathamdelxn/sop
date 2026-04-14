
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import SuperAdmin from "@/model/SuperAdmin";
import SuperManager from "@/model/SuperManager";
import Company from "@/model/Company";
import User from "@/model/User";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, password, companyId } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    console.log("🔍 Login attempt for:", username, "Company:", companyId || "GLOBAL");

    // 1. Search in Collections
    // Check SuperManager (System Admin) first - ALWAYS GLOBAL
    let user = await SuperManager.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    let roleFound = "super-manager";

    if (!user) {
      // For all other roles (Admins and Workers), Company ID is MANDATORY
      if (!companyId || companyId.trim() === "") {
        console.warn("⚠️ Login blocked: Missing Company ID for:", username);
        return NextResponse.json(
          { success: false, message: "Company ID is required for this account." },
          { status: 400 }
        );
      }

      // Check SuperAdmin (Company Admin)
      user = await SuperAdmin.findOne({ 
        $or: [{ username }, { email: username }],
        companyId: companyId 
      });
      roleFound = "company-admin";
    }

    if (!user) {
      // Check Regular User (Worker)
      user = await User.findOne({ 
        $or: [{ username }, { email: username }],
        companyId: companyId
      });
      roleFound = user?.role || "worker";
    }

    if (!user) {
      console.warn("❌ User not found in any collection for:", username, "Company:", companyId);
      return NextResponse.json(
        { success: false, message: "User not found or invalid Company ID." },
        { status: 404 }
      );
    }

    console.log(`✅ User found in ${roleFound} context:`, user.username);

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 3. Resolve Tenant Context & Features
    let enabledFeatures = [];
    let resolvedCompanyId = user.companyId || companyId || null;

    // For Company Admins and Users, fetch feature flags from the Company record
    if (roleFound !== "super-manager") {
      if (resolvedCompanyId) {
        let company = await Company.findOne({ companyId: resolvedCompanyId });
        
        // --- BUDFIX: Robust Fallback for Legacy IDs ---
        // If not found by slug, and it's a valid ObjectId, it might be a legacy hex ID
        if (!company && typeof resolvedCompanyId === 'string' && resolvedCompanyId.length === 24) {
          try {
             const admin = await SuperAdmin.findById(resolvedCompanyId);
             if (admin && admin.companyId) {
                console.log(`🔗 Resolving features via legacy ID correlation for: ${resolvedCompanyId} -> ${admin.companyId}`);
                resolvedCompanyId = admin.companyId; // Update to the correct slug
                company = await Company.findOne({ companyId: resolvedCompanyId });
             }
          } catch (e) { /* ignore cast errors */ }
        }
        // ----------------------------------------------

        if (company) {
          enabledFeatures = company.enabledFeatures || [];
        }
      } 
      
      // Secondary fallback to user's own features array if still empty
      if (enabledFeatures.length === 0 && user.features && user.features.length > 0) {
        enabledFeatures = user.features;
      }
    } else {
      // System Admin has access to everything
      enabledFeatures = ["CHECKLIST", "PHARMA-ELOGBOOK", "NON-PHARMA-ELOGBOOK", "OPERATION"];
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: roleFound,
        companyId: resolvedCompanyId,
        features: enabledFeatures
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Build Response
    const responseUser = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: roleFound,
      companyId: resolvedCompanyId,
      features: enabledFeatures
    };

    // Add extra fields for specific roles
    if (roleFound === "company-admin") {
      responseUser.status = user.status;
      responseUser.name = user.name;
    } else if (roleFound !== "super-manager") {
      responseUser.status = user.status;
      responseUser.phone = user.phone;
      responseUser.name = user.name;
      responseUser.task = user.task;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        token,
        user: responseUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}


