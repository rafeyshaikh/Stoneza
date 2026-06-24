"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [view, setView] = useState("phone"); // "phone" | "email"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetOtp = async () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert(`OTP sent to +91 ${phone}`);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert(`Logging in as ${email}`);
  };

  return (
    <div className="min-h-screen bg-[#eae8e2] flex flex-col items-center justify-start pt-[72px] px-4 pb-10 font-body">
      <div className="w-full max-w-[420px]">
        {/* ── Title ── */}

        {view === "phone" ? (
          <>
            {/* ── Phone row ── */}
            <h1 className="text-center text-[30px] font-normal tracking-[-0.2px] text-[#1a1a1a] mb-9 font-body">
              Login/Sign up
            </h1>
            <div className="flex gap-2 mb-[10px]">
              {/* +91 prefix */}
              <div className="shrink-0 w-24 h-[54px] bg-white border border-[#d4cfc9] rounded-xl flex items-center justify-center text-base text-[#5a5550] select-none">
                +91
              </div>

              {/* Phone input */}
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                placeholder="Phone number"
                onChange={(e) => {
                  setError("");
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                }}
                onKeyDown={(e) => e.key === "Enter" && handleGetOtp()}
                className="flex-1 h-[54px] bg-white border border-[#d4cfc9] px-4 text-base text-[#1a1a1a] placeholder:text-[#b0aaa4] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#5b4f46]"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#c0392b] text-xs text-center mb-2">{error}</p>
            )}

            {/* ── GET OTP button ── */}
            <Button
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full h-[52px] bg-[#5b4f46] hover:bg-[#4a3f37] text-white text-[13px] tracking-[2.5px] uppercase rounded-[6px] border-none shadow-none mb-6 disabled:opacity-75 disabled:cursor-not-allowed font-heading font-normal"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Sending…" : "GET OTP"}
            </Button>

            {/* ── Helper text ── */}
            <p className="text-center text-[14px] text-[#6A6A6A] leading-[1.6] mb-7">
              Don&apos;t have an account? Enter your mobile number to continue
              to register.
            </p>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3.5 mb-6">
              <Separator className="flex-1 h-px bg-[#ccc8c2]" />
              <span className="text-[14px] text-black whitespace-nowrap">
                Or continue with
              </span>
              <Separator className="flex-1 h-px bg-[#ccc8c2]" />
            </div>

            {/* ── Login with Email/Password ── */}
            <div className="flex items-center justify-center mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setView("email");
                setError("");
              }}
              className="px-4 h-[52px] bg-white border-[1.5px] border-[#c8c3bd] rounded-lg text-[14px] font-normal text-[#2a2a2a] shadow-none cursor-pointer hover:bg-white"
            >
              Login with Email/Password
            </Button>
            </div>
          </>
        ) : (
          <>
            {/* Email */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
              className="w-full h-[54px] border border-[#d4cfc9] rounded-none px-5 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 mb-4"
            />

            {/* Password + Forgot Password */}
            <div className="relative mb-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                className="w-full h-[54px] border border-[#d4cfc9] rounded-none px-5 pr-36 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#6e7885] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="text-[#c0392b] text-xs text-center mb-2">{error}</p>
            )}

            {/* Login Button */}
            <Button
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full h-[58px] bg-[#665b54] hover:bg-[#5a4f48] text-white tracking-[4px] text-[12px] font-heading rounded-none mb-8 font-normal"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "LOGGING IN..." : "LOGIN"}
            </Button>

            {/* Register Text */}
            <div className="text-center mb-5">
              <p className="text-[14px] text-[#6f6f6f] leading-8">
                Don't have an account? Enter your mobile number to continue to
                register.
              </p>

              <button
                onClick={() => {
                  setView("phone");
                  setError("");
                }}
                className="text-[14px] text-[#2c2c2c] cursor-pointer"
              >
                Create one
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3.5 mb-6">
              <Separator className="flex-1 h-px bg-[#ccc8c2]" />
              <span className="text-[14px] text-black whitespace-nowrap">
                Or continue with
              </span>
              <Separator className="flex-1 h-px bg-[#ccc8c2]" />
            </div>

            {/* Phone Login */}
            <div className="flex items-center justify-center mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setView("phone");
                setError("");
              }}
              className="px-4 h-[56px] bg-white border border-[#c8c3bd] rounded-md text-[14px] text-[#1f1f1f] hover:bg-white cursor-pointer shadow-none"
            >
              Login/Register with Phone Number
            </Button>
            </div>
          </>
        )}

        {/* ── Welcome Offer ── */}
        <div className="mt-20 text-left">
          <p className="text-[14px] font-bold text-[#1e1e1e] mb-2.5">
            Welcome Offer – Get Up to ₹1500 Off on Your First Order!
          </p>
          <p className="text-[14px] text-[#3a3530] leading-[1.65]">
            Sign Up with us and Enjoy Exclusive Savings on your very First
            Purchase above ₹5,000
          </p>
          <p className="text-[14px] text-[#3a3530] leading-[1.65] mt-10">
            Shop Luxury like Never Before and Unlock the Perfect Offer for Your
            Cart Value:
          </p>
          <ul className="list-disc pl-4">
            <li className="text-[14px] text-[#3a3530] leading-[1.65]">
              Use Code AH500 – Get ₹500 Off on Orders between ₹5,000 to ₹9,999
            </li>
            <li className="text-[14px] text-[#3a3530] leading-[1.65]">
              Use Code AH1000 – Get ₹1,000 Off on Orders between ₹10,000 to
              ₹14,999
            </li>
            <li className="text-[14px] text-[#3a3530] leading-[1.65]">
              Use Code AH1500 – Get ₹1,500 Off on Orders of ₹15,000 & above
            </li>
          </ul>
          <p className="text-[14px] text-[#3a3530] leading-[1.65] mt-10">
            Offer Valid Only on Your First Order. Don’t Miss Out – Sign Up and
            Indulge in Luxe Living!
          </p>
        </div>
      </div>
    </div>
  );
}
