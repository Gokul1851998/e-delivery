"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, { message: "Please enter a valid 6-digit code." }),
});

export function LoginForm2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  // ✅ Verify OTP
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const loadingToast = toast.loading("Verifying OTP...");

      const cleanedNumber = mobile.replace(/\s+/g, "");
      const formattedMobile = cleanedNumber.startsWith("+")
        ? cleanedNumber
        : `+${cleanedNumber}`;

      const formData = new FormData();
      formData.append("mobile", formattedMobile);
      formData.append("otp", data.code);

      const res = await api.post("/auth/verify-otp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.dismiss(loadingToast);
      if (res.data.success) {
        toast.success(res.data.message || "OTP verified successfully!");

        if (res.data.login) {
          sessionStorage.setItem("access_token", res.data.access_token);
          sessionStorage.setItem("refresh_token", res.data.refresh_token);
          router.push(`/auth/addDetails?mobile=${formattedMobile}`);
        } else {
          sessionStorage.setItem("mobile", formattedMobile);
        }
      } else {
        toast.error(res.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error: unknown) {
      toast.dismiss();

      // Use a type guard to check if it's an AxiosError
      if (error instanceof Error) {
        console.error("OTP Error:", error.message);
      }

      // If you're using Axios, safely check for response data:
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong. Please try again.";

      toast.error(message);
    }
  };

  // 🔁 Resend OTP handler
  const handleResendOTP = async () => {
    try {
      setResendLoading(true);

      const cleanedNumber = mobile.replace(/\s+/g, "");
      const formattedMobile = cleanedNumber.startsWith("+")
        ? cleanedNumber
        : `+${cleanedNumber}`;

      const formData = new FormData();
      formData.append("mobile", formattedMobile);

      const res = await api.post("/auth/send-otp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP resent successfully!");

        startCooldown(); // prevent multiple requests
      } else {
        toast.error(res.data.message || "Failed to resend OTP.");
      }
    } catch (error: unknown) {
      toast.dismiss();

      // If you're using Axios, safely check for response data:
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong. Try again.";

      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  // ⏱ 30-second cooldown for Resend button
  const startCooldown = () => {
    setCooldown(30);
    // clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full space-y-4"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Enter the code we texted you
          </h2>
          <p className="text-sm text-gray-500">
            We&apos;ve sent an SMS to {mobile}
          </p>
        </div>

        {/* Input field section */}
        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMS Code</FormLabel>
                <FormControl>
                  <Input
                    id="code"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 focus:border-primary"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="Enter the 6-digit code"
                    autoComplete="one-time-code"
                    autoFocus
                    {...field}
                    onChange={(e) => {
                      // allow only digits
                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                      field.onChange(v);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-xs text-gray-500">
            Your 6-digit code is on its way. This can sometimes take a few
            moments to arrive.
          </p>

          <button
            type="button"
            disabled={resendLoading || cooldown > 0}
            onClick={handleResendOTP}
            className={`text-primary font-semibold underline transition-all duration-200 ${
              resendLoading || cooldown > 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-primary/80 active:scale-95"
            }`}
          >
            {resendLoading
              ? "Resending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
          </button>
        </div>

        <Button
          className="w-full py-5 text-base pt-auto"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Verifying..." : "Get Started"}
        </Button>
      </form>
    </Form>
  );
}
