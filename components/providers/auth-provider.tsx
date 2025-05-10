import { getCurrentUserInfo } from "@/app/actions/users";
import { useAuth } from "@/store/useAuth";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, removeUser } = useAuth();
  const { isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await getCurrentUserInfo();
      if (user) {
        setUser(user);
      } else {
        removeUser();
      }

      return user;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <>Error: {error}</>;
  }

  return <>{children}</>;
}
