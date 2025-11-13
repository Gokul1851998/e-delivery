"use client";

import background from "../../../../public/background.png";
import LoginCard from "../components/login-card";
import { LoginForm3 } from "../components/login-form3";

export default function LoginV3() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="flex w-[900px] max-w-full overflow-hidden rounded-2xl bg-[#1e293b]/90 shadow-2xl backdrop-blur-md">
        <LoginCard />
        <div className="flex w-full lg:w-1/2   bg-white p-10">
          <div className="w-full max-w-sm space-y-6">
            <LoginForm3 />
          </div>
        </div>
      </div>
    </div>
  );
}
