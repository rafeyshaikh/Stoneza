"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function VerifyRegisterPage({ params }) {
  const { token } = use(params);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
  if (token) {
    verifyEmail();
  }
}, [token]);

  const verifyEmail = async () => {
  try {
    console.log("Token:", token);

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      throw new Error(data.message);
    }

    setSuccess(true);
    toast.success(data.message);
  } catch (error) {
    console.error(error);
    toast.error(error.message);
    setSuccess(false);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-5 text-[#665b54]" />

          <h2 className="font-display text-3xl mb-3">
            Verifying Email
          </h2>

          <p className="text-gray-500">
            Please wait...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="max-w-[500px] text-center">
        {success ? (
          <>
            <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-6" />

            <h1 className="font-display text-4xl mb-4">
              Email Verified
            </h1>

            <p className="text-gray-600 mb-8">
              Your account has been successfully verified.
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-20 h-20 mx-auto text-red-600 mb-6" />

            <h1 className="font-display text-4xl mb-4">
              Verification Failed
            </h1>

            <p className="text-gray-600 mb-8">
              This verification link is invalid or has expired.
            </p>
          </>
        )}

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center h-[56px] px-8 bg-[#665b54] text-white tracking-[3px] text-xs"
        >
          GO TO LOGIN
        </Link>
      </div>
    </section>
  );
}