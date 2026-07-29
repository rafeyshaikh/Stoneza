"use client";

import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasswordSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      toast.success(data.message || "Password updated successfully");
      setIsOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="font-bold text-md mb-4 uppercase tracking-wider text-stone-800">
        Password Settings
      </h2>

      <div className="bg-stone-100 rounded-xl p-5 mb-8 border border-stone-200">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="bg-white p-3 rounded-lg text-stone-700 shadow-xs">
              <Lock size={18} />
            </div>

            <div>
              <p className="tracking-[4px] font-bold text-stone-800">
                ••••••••••••
              </p>
              <p className="text-sm text-stone-500">
                Account Security Password
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setError("");
            }}
            className="border border-[#5b4f46] text-[#5b4f46] hover:bg-[#5b4f46] hover:text-white transition px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            {isOpen ? "Cancel" : "Update Password"}
          </button>
        </div>

        {isOpen && (
          <form onSubmit={handleChangePassword} className="mt-5 pt-5 border-t border-stone-200 space-y-4">
            <div>
              <label htmlFor="current-pass" className="block text-xs font-semibold text-stone-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Input
                  id="current-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setError("");
                    setCurrentPassword(e.target.value);
                  }}
                  className="bg-white border-stone-300 h-10 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="new-pass-profile" className="block text-xs font-semibold text-stone-700 mb-1">
                  New Password
                </label>
                <Input
                  id="new-pass-profile"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setError("");
                    setNewPassword(e.target.value);
                  }}
                  className="bg-white border-stone-300 h-10 text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirm-pass-profile" className="block text-xs font-semibold text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  id="confirm-pass-profile"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmPassword(e.target.value);
                  }}
                  className="bg-white border-stone-300 h-10 text-sm"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#5b4f46] hover:bg-[#4a3f37] text-white text-xs px-6 h-10 font-medium cursor-pointer"
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {loading ? "Updating..." : "Save New Password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}