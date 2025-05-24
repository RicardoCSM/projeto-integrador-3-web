"use client";

import { LoginForm } from "@/components/common/auth/login-form";
import { ModeToggle } from "@/components/theme-toggle";

export default function SignIn() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
