"use client";

import { LoginForm } from "../components/login-form1"; 
import background from "../../../../public/background.png";
import LoginCard from "../components/login-card";

export default function LoginV1() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Outer card */}
      <div className="flex w-[900px] max-w-full overflow-hidden rounded-2xl bg-[#1e293b]/90 shadow-2xl backdrop-blur-md">
        {/* Left Side */}
        <LoginCard />

        {/* Right Side */}
        <div className="flex w-full lg:w-1/2   bg-white p-10">
          <div className="w-full max-w-sm space-y-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
