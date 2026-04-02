"use client";

import AuthForm from "@/componants/auth/AuthForm";
import Link from "next/link";
import api from "@/componants/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // ✅ Added Suspense
import axios, { AxiosError } from "axios";

// 1. Component containing the logic
const VerifyOTPContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerifyOTP = async (data: Record<string, string | FileList>) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (!email) {
        setError("Email not found. Please restart the reset process.");
        return;
      }

      const otp = data.otp as string;

      const res = await api.post("/auth/verifyotp", {
        email,
        otp,
      });

      setSuccess(res.data.message || "OTP verified successfully!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      let message = "OTP verification failed";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{
          message?: string;
          error?: string;
        }>;
        message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Verify OTP"
      formWidth="max-w-[400px]"
      fields={[
        {
          label: "Enter the OTP sent to your email",
          type: "text",
          name: "otp",
          placeholder: "Enter OTP",
        },
      ]}
      buttonText="Verify OTP"
      onSubmit={handleVerifyOTP}
      isLoading={isLoading}
      error={error}
      success={success}
      footer={
        <p className="text-center !mt-5 text-[#aaaaaa] text-[15px]">
          Didn’t receive the code?{" "}
          <Link
            href="/forgot-password"
            className="text-white underline font-semibold"
          >
            Resend
          </Link>
        </p>
      }
      backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1470&q=80"
    />
  );
};

// 2. Main export wrapped in Suspense
export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="text-white text-center mt-10">Verifying...</div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
