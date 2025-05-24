"use server";

import { cookies } from "next/headers";
import { getToken, signOut } from "./auth";
import { User } from "@/types/User";

export async function getCurrentUserInfo(): Promise<User | null> {
  try {
    if (!(await cookies()).get("access_token")) {
      return null;
    }

    const jsonUser = await getToken();

    if (!jsonUser) {
      return null;
    }

    const user: User = JSON.parse(jsonUser);

    return user;
  } catch (e) {
    console.error(e);
    await signOut();
    return null;
  }
}
