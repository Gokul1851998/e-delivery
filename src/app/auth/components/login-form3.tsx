"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import api from "@/lib/axios";

// ✅ Validation schema
const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Please enter a valid email address." }),
  qualification: z.string().min(1, "Qualification is required"),
  profile: z.any().refine((file) => file instanceof File, {
    message: "Profile image is required",
  }),
});

export function LoginForm3() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      qualification: "",
      profile: null,
    },
  });

  // ✅ Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("profile", file);
    }
  };

  // ✅ Remove uploaded image
  const handleRemoveImage = () => {
    setPreview(null);
    form.setValue("profile", undefined);
  };

  // ✅ Handle submit
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const cleanedNumber = mobile.replace(/\s+/g, "");
      const formattedMobile = cleanedNumber.startsWith("+")
        ? cleanedNumber
        : `+${cleanedNumber}`;

      const loadingToast = toast.loading("Creating profile...");
      const formData = new FormData();
      formData.append("mobile", formattedMobile);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("qualification", data.qualification);
      if (data.profile) {
        formData.append("profile_image", data.profile);
      }

      const res = await api.post("/auth/create-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.dismiss(loadingToast);

      if (res.data.success) {
        toast.success(res.data.message || "Profile created successfully!");
        sessionStorage.setItem("access_token", res.data.access_token);
        sessionStorage.setItem("refresh_token", res.data.refresh_token);
        router.push("/home");
      } else {
        toast.error(res.data.message || "Profile creation failed.");
      }
    } catch (error: unknown) {
  toast.dismiss();
  // If you're using Axios, safely check for response data:
  const message =
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || "Something went wrong. Please try again.";

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
            Add Your Details
          </h2>
        </div>

        {/* ✅ Profile upload section */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <label
              htmlFor="profile"
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Profile Preview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500 text-xs flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Profile Picture
                </div>
              )}
              <input
                id="profile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* ✅ Remove Button (only visible when image selected) */}
            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-900"
                aria-label="Remove image"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Input fields */}
        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your Full Name"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualification*</FormLabel>
                <FormControl>
                  <Input
                    id="qualification"
                    type="text"
                    placeholder="Enter your Qualification"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <Button className="w-full py-5 text-base" type="submit">
          Get Started
        </Button>
      </form>
    </Form>
  );
}
