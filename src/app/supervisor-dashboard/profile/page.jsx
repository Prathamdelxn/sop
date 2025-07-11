"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Loader2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          throw new Error("Authentication required. Please login.");
        }

        // Direct API call instead of using getProfile from context
        const response = await fetch("/api/profile/fetch", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const profileData = await response.json();
        setProfile({
          ...profileData.user,
          department: getDepartmentFromRole(profileData.user.role),
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
        if (
          err.message.includes("Unauthorized") ||
          err.message.includes("expired")
        ) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout]);

  const getDepartmentFromRole = (role) => {
    const roleMap = {
      admin: "Administration",
      "facility-admin": "Facility Management",
      "user-facility-admin": "Facility Management",
      supervisor: "Operations",
      operator: "Operations",
      QA: "Quality Control",
    };
    return roleMap[role] || "General";
  };

  const formatRoleName = (role) => {
    if (!role) return "User";
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Loading Profile</h2>
          <p className="text-gray-600 mt-2">
            Please wait while we fetch your information
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any profile information
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-600">
              Personal information and account details
            </p>
          </div>
        
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 pb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-indigo-600 font-medium">
                  {formatRoleName(profile.role)}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  {profile.department}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Phone className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">
                        {profile.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {profile.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Work Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">
                      {formatRoleName(profile.role)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">
                      {profile.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {profile.status || "active"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
