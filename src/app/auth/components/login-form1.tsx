"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Show a small toast while processing
      toast.loading("Sending OTP...");

      // Prepare form data
      const formData = new FormData();
      formData.append("mobile", data.phone);

      // Send API request
      const res = await api.post("/auth/send-otp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Close the loading toast
      toast.dismiss();

      // Handle response
      if (res?.data?.success) {
        toast.success(res.data.message || "OTP sent successfully ✅");

        // Navigate to OTP page and pass mobile in URL
        router.push(`/auth/otp?mobile=${data.phone}`);
      } else {
        toast.error(res?.data?.message || "Failed to send OTP ❌");
      }
    } catch (error: unknown) {
      toast.dismiss();

      // If you're using Axios, safely check for response data:
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong while sending OTP";

      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full space-y-4"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Enter your phone number
          </h2>
          <p className="text-sm text-gray-500">
            We use your mobile number to identify your account
          </p>
        </div>
        {/* Input field section */}
        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    id="phone"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 focus:border-primary"
                    type="tel"
                    placeholder="+91 1234 567891"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-center text-xs text-gray-500">
          By tapping <span className="font-medium">Get Started</span>, you agree
          to the{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms & Conditions
          </Link>
        </p>
        {/* Bottom section with Terms & Button */}

        <Button className="w-full py-5 text-base pt-auto" type="submit">
          Get Started
        </Button>
      </form>
    </Form>
  );
}
export default LoginForm;
