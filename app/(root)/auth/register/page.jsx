"use client";

import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { zSchema } from "@/lib/zodSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = zSchema
    .pick({
      name: true,
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z
        .string()
        .min(1, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (values) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      toast.success(
        "Registration successful! Please check your email to verify your account."
      );

      form.reset();

      // router.push("/auth/verify-email");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-[500px] mx-auto px-5 py-16">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="font-display text-[34px] text-[#2c2c2c] mb-3">
          Create Account
        </h1>

        <p className="text-[14px] text-[#6f6f6f]">
          Register with your email to continue.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <Input
            placeholder="Full Name"
            {...form.register("name")}
            className="w-full h-[54px] border border-[#d4cfc9] rounded-none px-5 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {form.formState.errors.name && (
            <p className="text-[#c0392b] text-xs mt-2">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...form.register("email")}
            className="w-full h-[54px] border border-[#d4cfc9] rounded-none px-5 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {form.formState.errors.email && (
            <p className="text-[#c0392b] text-xs mt-2">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...form.register("password")}
              className="w-full h-[54px] border border-[#d4cfc9] rounded-none px-5 pr-14 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f6f6f] hover:text-black transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {form.formState.errors.password && (
            <p className="text-[#c0392b] text-xs mt-2">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...form.register("confirmPassword")}
              className="w-full h-[54px] border border-[#d4cfc9] rounded-none px-5 pr-14 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f6f6f] hover:text-black transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {form.formState.errors.confirmPassword && (
            <p className="text-[#c0392b] text-xs mt-2">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-[58px] bg-[#665b54] hover:bg-[#5a4f48] text-white tracking-[4px] text-[12px] font-heading rounded-none font-normal"
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {loading
            ? "CREATING ACCOUNT..."
            : "CREATE ACCOUNT"}
        </Button>
      </form>

      {/* Verification Notice */}
      <div className="text-center mt-8 mb-6">
        <p className="text-[14px] text-[#6f6f6f] leading-4 italic">
          After registering, you will receive an email to verify
          your account. Please check your inbox and spam folder.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3.5 mb-6">
        <Separator className="flex-1 h-px bg-[#ccc8c2]" />

        <span className="text-[14px] text-black whitespace-nowrap">
          Secure Registration
        </span>

        <Separator className="flex-1 h-px bg-[#ccc8c2]" />
      </div>

      {/* Login */}
      <div className="text-center mb-1">
        <p className="text-[14px] text-[#6f6f6f] leading-8">
          Already have an account?
        </p>
      </div>

      <div className="flex items-center justify-center mb-6">
        <Link
          href="/auth/login"
          className="px-4 h-[56px] bg-white border border-[#c8c3bd] rounded-md text-[14px] text-[#1f1f1f] hover:bg-white shadow-none flex items-center justify-center"
        >
          Login with Email/Password
        </Link>
      </div>

      {/* Terms */}
      <p className="text-center text-[13px] text-[#6f6f6f] leading-6">
        By creating an account, you agree to our Terms of Service
        and Privacy Policy.
      </p>
    </section>
  );
}

