"use client";

import { useState, useEffect } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import ProfileInfo from "@/components/account/ProfileInfo";
import PasswordSection from "@/components/account/PasswordSection";
import AddressSection from "@/components/account/AddressSection";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setUser(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-[#6f6f6f] text-lg">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-red-500 text-lg">User not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f4f2ed] py-8">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <AccountSidebar />

          <div className="bg-white rounded-2xl p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <ProfileInfo user={user} />

              <div>
                <PasswordSection />

                <AddressSection user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}