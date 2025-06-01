import { redirect } from "next/navigation";
import { getToken } from "./actions/auth";

export default async function Home() {
  const token = await getToken();

  if (!token) {
    redirect("/sign-in");
  }

  redirect("/dashboard");
}
