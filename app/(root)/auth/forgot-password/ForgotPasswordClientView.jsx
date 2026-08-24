"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordClientView() {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset code");

      toast.success(data.message || "Verification code sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the verification code sent to your email");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      toast.success(data.message || "Password reset successfully!");
      setStep(3);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eae8e2] flex flex-col items-center justify-start pt-[80px] px-4 pb-12 font-body">
      <div className="w-full max-w-[420px]">
        {/* Back Link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#57534e] hover:text-[#1c1917] transition-colors mb-6"
        >
          <ArrowLeft className="size-3.5" />
          Back to Login
        </Link>

        {step === 1 && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#d4cfc9]">
            <div className="flex justify-center mb-4">
              <div className="size-12 rounded-full bg-[#f4f2ed] flex items-center justify-center text-[#5b4f46]">
                <KeyRound className="size-6" />
              </div>
            </div>

            <h1 className="text-center text-xl font-medium tracking-tight text-[#1a1a1a] mb-2 font-heading">
              Forgot Your Password?
            </h1>
            <p className="text-center text-xs text-[#6A6A6A] leading-relaxed mb-6">
              Enter the email address registered with your Stoneza account and we&apos;ll send you a verification code to reset your password.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-xs font-semibold text-[#3a3530] mb-1.5">
                  Email Address
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                  className="w-full h-12 border-[#d4cfc9] bg-[#faf8f5] px-4 text-sm focus-visible:ring-1 focus-visible:ring-[#5b4f46]"
                />
              </div>

              {error && <p className="text-red-600 text-xs text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#5b4f46] hover:bg-[#4a3f37] text-white text-xs tracking-[2px] uppercase rounded-lg border-none shadow-none font-heading font-medium cursor-pointer"
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {loading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#d4cfc9]">
            <h1 className="text-center text-xl font-medium tracking-tight text-[#1a1a1a] mb-2 font-heading">
              Reset Your Password
            </h1>
            <p className="text-center text-xs text-[#6A6A6A] leading-relaxed mb-6">
              Verification code sent to <strong className="text-[#1a1a1a]">{email}</strong>. Enter the code and set your new password.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-otp" className="block text-xs font-semibold text-[#3a3530] mb-1.5">
                  Verification Code (OTP)
                </label>
                <Input
                  id="reset-otp"
                  type="text"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => {
                    setError("");
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  }}
                  className="w-full h-12 border-[#d4cfc9] bg-[#faf8f5] px-4 text-center tracking-[6px] text-lg font-bold focus-visible:ring-1 focus-visible:ring-[#5b4f46]"
                />
              </div>

              <div>
                <label htmlFor="new-pass" className="block text-xs font-semibold text-[#3a3530] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="new-pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setError("");
                      setNewPassword(e.target.value);
                    }}
                    className="w-full h-12 border-[#d4cfc9] bg-[#faf8f5] px-4 pr-11 text-sm focus-visible:ring-1 focus-visible:ring-[#5b4f46]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f6f6f] hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-pass" className="block text-xs font-semibold text-[#3a3530] mb-1.5">
                  Confirm New Password
                </label>
                <Input
                  id="confirm-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmPassword(e.target.value);
                  }}
                  className="w-full h-12 border-[#d4cfc9] bg-[#faf8f5] px-4 text-sm focus-visible:ring-1 focus-visible:ring-[#5b4f46]"
                />
              </div>

              {error && <p className="text-red-600 text-xs text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#5b4f46] hover:bg-[#4a3f37] text-white text-xs tracking-[2px] uppercase rounded-lg border-none shadow-none font-heading font-medium cursor-pointer"
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {loading ? "Resetting Password..." : "Set New Password"}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-[#78716c] hover:underline pt-2 block cursor-pointer"
              >
                Didn&apos;t receive code? Resend
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#d4cfc9] text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="size-14 text-emerald-600" />
            </div>
            <h1 className="text-xl font-medium text-[#1a1a1a] font-heading">
              Password Reset Complete!
            </h1>
            <p className="text-xs text-[#6A6A6A] leading-relaxed">
              Your password has been successfully updated. You can now log in using your new credentials.
            </p>

            <Link href="/auth/login" className="block pt-2">
              <Button className="w-full h-12 bg-[#5b4f46] hover:bg-[#4a3f37] text-white text-xs tracking-[2px] uppercase rounded-lg font-heading cursor-pointer">
                Return to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
