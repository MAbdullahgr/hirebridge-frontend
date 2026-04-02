"use client";

import AuthForm from "@/componants/auth/AuthForm";
import Link from "next/link";
import api from "@/componants/lib/axios";
import axios, { AxiosError } from "axios";
import { useState, Suspense } from "react"; // ✅ Import Suspense
import { useRouter, useSearchParams } from "next/navigation";

// 1. Move the logic into a separate component
const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (data: Record<string, string | FileList>) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/auth/login", { ...data });
      const token = res.data.token;
      if (token) localStorage.setItem("token", token);

      setSuccess("Login successful!");
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err) {
      let message = "Login failed";
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
      title="Login to Your Account"
      formWidth="max-w-[500px]"
      fields={[
        {
          label: "Email Address",
          type: "email",
          name: "email",
          placeholder: "Enter your email",
        },
        {
          label: "Password",
          type: "password",
          name: "password",
          placeholder: "Enter your password",
        },
      ]}
      buttonText="Login"
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      success={success}
      footer={
        <>
          <p className="text-center !mt-5 text-[#aaaaaa] text-[15px]">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-white underline font-semibold">
              Sign up
            </Link>
          </p>
          <p className="text-center !mt-5 text-[#aaaaaa] text-[15px]">
            <Link
              href="/forgot-password"
              className="text-white underline font-semibold"
            >
              Forget Password
            </Link>
          </p>
        </>
      }
      backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1470&q=80"
    />
  );
};

// 2. Wrap the component in Suspense for the main export
export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center mt-10">Loading...</div>}
    >
      <LoginContent />
    </Suspense>
  );
}
