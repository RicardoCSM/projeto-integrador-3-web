import { redirect } from "next/navigation";
import { getToken } from "./actions/auth";

export default async function Home() {
  const token = await getToken();

  if (!token) {
    return redirect("/sign-in");
  }

  return redirect("/dashboard");
}
