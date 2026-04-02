"use client";

import AuthForm from "@/componants/auth/AuthForm";
import api from "@/componants/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // ✅ Added Suspense
import axios, { AxiosError } from "axios";

// 1. Move logic into a sub-component
const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (
    data: Record<string, string | FileList>,
  ) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (!email) {
        setError("Email not found. Please restart the reset process.");
        return;
      }

      const newPassword = data.newPassword as string;
      const confirmPassword = data.confirmPassword as string;

      if (!newPassword || !confirmPassword) {
        setError("Both fields are required");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const res = await api.put("/auth/resetpassword", {
        email,
        newPassword,
        confirmPassword,
      });

      setSuccess(res.data.message || "Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      let message = "Password reset failed";
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
      title="Set New Password"
      formWidth="max-w-[400px]"
      fields={[
        {
          label: "New Password",
          type: "password",
          name: "newPassword",
          placeholder: "Enter new password",
        },
        {
          label: "Confirm New Password",
          type: "password",
          name: "confirmPassword",
          placeholder: "Confirm new password",
        },
      ]}
      buttonText="Reset Password"
      onSubmit={handleResetPassword}
      isLoading={isLoading}
      error={error}
      success={success}
      backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1470&q=80"
    />
  );
};

// 2. Export the wrapped component
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-white text-center mt-10">
          Loading reset form...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
