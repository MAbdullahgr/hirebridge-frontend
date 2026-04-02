"use client";

import AuthForm from "@/componants/auth/AuthForm";
import Link from "next/link";
import api from "@/componants/lib/axios";
import { useState, Suspense } from "react"; // ✅ Added Suspense
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Define a strong, reusable form data interface
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: "male" | "female";
  avatar?: FileList;
}

// 1. Move logic into a sub-component
const SignupContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (
    data: Record<string, string | FileList>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatar" && value instanceof FileList && value.length > 0) {
          formData.append("avatar", value[0]);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registration successful!");
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err: unknown) {
      let message = "Registration failed";
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
      title="Registration Form"
      formWidth="max-w-[600px]"
      fields={[
        {
          label: "Username",
          type: "text",
          name: "username",
          placeholder: "Enter your username",
        },
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
        {
          label: "Phone",
          type: "tel",
          name: "phone",
          placeholder: "Enter your phone number",
        },
        { label: "Date of Birth", type: "date", name: "dob" },
        { label: "Profile Picture", type: "file", name: "avatar" },
        {
          label: "Gender",
          type: "select",
          name: "gender",
          options: [
            { label: "Female", value: "female" },
            { label: "Male", value: "male" },
          ],
        },
      ]}
      buttonText="Register"
      onSubmit={handleRegister}
      isLoading={isLoading}
      error={error}
      success={success}
      footer={
        <p className="text-center !mt-5 text-[#aaaaaa] text-[15px]">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline font-semibold">
            Sign in
          </Link>
        </p>
      }
      backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1470&q=80"
    />
  );
};

// 2. Export wrapped in Suspense
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="text-white text-center mt-10">Loading signup...</div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
