import { QueryProvider } from "@/components/providers/query-provider";
import { getToken } from "../actions/auth";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  if (token) {
    redirect("/dashboard");
  }

  return <QueryProvider>{children}</QueryProvider>;
}
