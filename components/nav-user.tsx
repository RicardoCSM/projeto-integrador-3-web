"use client";

import { LogOutIcon, UserCircleIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/User";
import Link from "next/link";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/app/actions/auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";

export function NavUser({ user }: { user: User }) {
  const router = useRouter();
  const { removeUser } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: signOut,
    onSuccess: (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        removeUser();
        router.push("/sign-in");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSignOut() {
    mutateAsync();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserCircleIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.id}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/card" target="_blank">
            <DropdownMenuItem>
              <UserCircleIcon />
              Carteirinha
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
