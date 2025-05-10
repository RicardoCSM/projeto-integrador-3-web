"use server";

import { cookies } from "next/headers";
import { signOut } from "./auth";
import { User } from "@/types/User";

export async function getCurrentUserInfo(): Promise<User | null> {
  try {
    if (!(await cookies()).get("access_token")) {
      return null;
    }

    // Fazer query para pegar os dados do usuário da planilha

    const response: User = {
      id: "1",
      birth_date: "2000-01-01",
      name: "John Doe",
    };

    return response;
  } catch (e) {
    console.error(e);
    await signOut();
    return null;
  }
}
