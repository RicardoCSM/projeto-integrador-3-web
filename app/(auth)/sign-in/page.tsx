"use client";

import AuthLayout from "@/components/common/auth/auth-layout";
import { LoginForm } from "@/components/common/auth/login-form";

export default function SignIn() {
  return (
    <AuthLayout>
      <LoginForm className="w-[400px]" />
    </AuthLayout>
  );
}
