"use client";

import AuthForm from "@/componants/auth/AuthForm";
import Link from "next/link";
import api from "@/componants/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add "| FileList" to the type definition here
  const handleForgotPassword = async (
    data: Record<string, string | FileList>,
  ) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      // Cast data.email to string so TypeScript knows it's not a FileList
      const email = data.email as string;

      const res = await api.post("/auth/sendotp", { email });

      setSuccess(res.data.message || "OTP sent successfully!");

      // Use the casted email variable here
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      let message = "Failed to send OTP";

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
      title="Reset Your Password"
      formWidth="max-w-[400px]"
      fields={[
        {
          label: "Enter your registered email",
          type: "email",
          name: "email",
          placeholder: "Enter your email",
        },
      ]}
      buttonText="Send OTP"
      onSubmit={handleForgotPassword}
      isLoading={isLoading}
      error={error}
      success={success}
      footer={
        <p className="text-center !mt-5 text-[#aaaaaa] text-[15px]">
          Remember your password?{" "}
          <Link href="/login" className="text-white underline font-semibold">
            Login
          </Link>
        </p>
      }
      backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1470&q=80"
    />
  );
};

export default ForgotPasswordPage;
