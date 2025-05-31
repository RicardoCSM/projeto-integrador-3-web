import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-3">
      <Image
        src="/images/vector.png"
        alt="Auth Illustration"
        width={480}
        height={480}
        priority
        className="hidden lg:block absolute bottom-0 left-0"
      />
      <div className="w-full hidden lg:flex relative h-full items-center justify-center"></div>
      <div className="flex bg-[#168a43] lg:rounded-l-3xl lg:col-span-2 min-h-screen items-center justify-center py-12">
        {children}
      </div>
      <Image
        src="/images/logo-eeaa.png"
        alt="Logo EEAA"
        width={60}
        height={60}
        priority
        className="absolute top-4 left-4"
      />
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
    </div>
  );
}
