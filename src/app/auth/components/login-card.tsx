import React from 'react'
import Image from 'next/image'
import loginIcon1 from "../../../../public/Iogin icon 1.png";
import loginIcon2 from "../../../../public/login icon 2.png";

export default function LoginCard() {
  return(
       <div className="hidden w-1/2 bg-[#1e293b] p-10 text-white lg:flex flex-col justify-center items-center space-y-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-md">
              <Image
                src={loginIcon1}
                alt="Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">NexLearn</h1>
              <p className="text-sm text-gray-300">futuristic learning</p>
            </div>
          </div>

          {/* Illustration */}
          <Image
            src={loginIcon2}
            alt="Login Illustration"
            width={288}
            height={180}
            className="object-contain"
            priority
          />
        </div>
  )
}
