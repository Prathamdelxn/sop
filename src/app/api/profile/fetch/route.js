// app/api/profile/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/db";

// Import all role models
import Admin from "@/model/Admin";
import FacilityAdmin from "@/model/FacilityAdmin";
import UserFacilityAdmin from "@/model/UserFacilityAdmin";
import Supervisor from "@/model/Supervisor";
import Operator from "@/model/Operator";
import QA from "@/model/QA";

const roleModels = {
  admin: Admin,
  "facility-admin": FacilityAdmin,
  "user-facility-admin": UserFacilityAdmin,
  supervisor: Supervisor,
  operator: Operator,
  QA: QA,
};

export async function GET(req) {
  await dbConnect();

  try {
    // 1. Extract and validate authorization header
    const authHeader = req.headers.get("authorization");
    console.log(
      "[Profile API] Authorization Header:",
      authHeader?.slice(0, 30) + "..."
    );

    if (!authHeader) {
      console.warn("[Profile API] No authorization header provided");
      return NextResponse.json(
        { message: "Authorization header is required" },
        { status: 401 }
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.warn("[Profile API] Invalid authorization format");
      return NextResponse.json(
        { message: "Authorization header must start with 'Bearer '" },
        { status: 401 }
      );
    }

    // 2. Extract and verify token
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("[Profile API] Empty token provided");
      return NextResponse.json(
        { message: "Token is required" },
        { status: 401 }
      );
    }

    console.log("[Profile API] Token received:", token.slice(0, 10) + "...");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[Profile API] Token decoded successfully:", {
        id: decoded.id,
        role: decoded.role,
      });
    } catch (verifyError) {
      console.error(
        "[Profile API] Token verification failed:",
        verifyError.message
      );
      throw verifyError; // Will be caught in the outer catch block
    }

    // 3. Validate user role
    const UserModel = roleModels[decoded.role];
    if (!UserModel) {
      console.warn(`[Profile API] Invalid role: ${decoded.role}`);
      return NextResponse.json(
        { message: "Invalid user role" },
        { status: 403 } // 403 Forbidden for invalid role
      );
    }

    // 4. Fetch user data
    const user = await UserModel.findById(decoded.id)
      .select("-password -__v -refreshToken") // Exclude sensitive fields
      .lean();

    if (!user) {
      console.warn(`[Profile API] User not found with ID: ${decoded.id}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 5. Format secure response
    const response = {
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: decoded.role, // Use role from token for consistency
        phone: user.phone || null,
        location: user.location || null,
        status: user.status || "active",
        // Add other non-sensitive fields as needed
        ...(user.avatar && { avatar: user.avatar }),
        ...(user.department && { department: user.department }),
      },
    };

    console.log("[Profile API] Profile fetched successfully for:", user.email);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[Profile API] Error:", error);

    // Specific error responses
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid or malformed token" },
        { status: 401 }
      );
    }
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "Token has expired" },
        { status: 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
        }),
      },
      { status: 500 }
    );
  }
}
