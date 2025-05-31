import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./theme-toggle";
import { NavUser } from "./nav-user";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";

export function SiteHeader() {
  const { user } = useAuth();

  return (
    <div className="fixed left-0 right-0 top-0 z-20 bg-[#168a43] backdrop-blur rounded-b-lg">
      <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <Image
            src="/images/logo-eeaa.png"
            alt="Logo EEAA"
            width={60}
            height={60}
          />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base text-white font-medium">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            {user && <NavUser user={user} />}
          </div>
        </div>
      </header>
    </div>
  );
}
