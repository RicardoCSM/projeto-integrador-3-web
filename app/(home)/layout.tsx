import { AuthProvider } from "@/components/providers/auth-provider";
import { getToken } from "../actions/auth";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/components/providers/query-provider";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  if (!token) {
    return redirect("/sign-in");
  }

  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
