"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import headerIcon from "../../../public/header-icon.png";
import api from "@/lib/axios";
import { toast } from "sonner";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading("Logging out...");

      // ✅ Call the logout API
      const res = await api.post("/auth/logout");

      // ✅ Clear session tokens
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("mobile");

      toast.dismiss(loadingToast);

      if (res.data?.success) {
        toast.success(res.data?.message || "Logged out successfully!");
      } else {
        toast.error(res.data?.message || "Logout failed!");
      }

      // ✅ Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      toast.dismiss();
      console.error("Logout Error:", error);
      toast.error("Something went wrong!");
      // Still ensure tokens are cleared
      sessionStorage.clear();
      router.push("/auth/login");
    }
  };

  // Hide header for specific auth routes
  const hideHeaderRoutes = ["/auth/addDetails", "/auth/otp", "/auth/login"];
  if (hideHeaderRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header className="relative flex items-center justify-center w-full px-4 sm:px-6 py-2 sm:py-3 bg-white shadow-sm border-b">
      {/* Center section - Logo and text */}
      <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <Image
          src={headerIcon}
          alt="NexLearn Logo"
          width={38}
          height={38}
          priority
        />
        <div className="text-center leading-tight">
          <h1 className="text-lg sm:text-xl font-semibold text-sky-800">
            NexLearn
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500">
            futuristic learning
          </p>
        </div>
      </div>

      {/* Right section - Logout button */}
      <button
        onClick={handleLogout}
        className="ml-auto cursor-pointer bg-sky-700 text-white text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-md hover:bg-sky-600 transition-all"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
