"use server";

import { cookies } from "next/headers";
import { getToken, signOut } from "./auth";
import { User } from "@/types/User";

/**
 * Função para obter as informações do usuário atual.
 * @returns Um objeto User com as informações do usuário ou null se não estiver autenticado.
 */
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
