"use server";

import { cookies } from "next/headers";
import CryptoJS from "crypto-js";
import { LoginSchema } from "@/lib/validations/login";
import { fetchStudents } from "@/app/actions/students";
import { formatDate } from "date-fns";

const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

export async function getToken(): Promise<string | null> {
  const encryptedToken = (await cookies()).get("access_token")?.value;
  if (encryptedToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);
    return originalToken;
  }
  return null;
}

export async function clearToken(): Promise<void> {
  (await cookies()).set("access_token", "", { expires: new Date(0) });
}

export async function login(data: LoginSchema): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const students = await fetchStudents(data.class);

    if (!students || students.length === 0) {
      return {
        success: false,
        message: "Nenhum aluno encontrado para a turma informada.",
      };
    }

    const formattedBirthDate = formatDate(data.birth_date, "dd/MM/yyyy");

    const student = students.find(
      (student) =>
        student.id === data.id && student.birth_date === formattedBirthDate
    );

    if (!student) {
      return {
        success: false,
        message: "Credenciais inválidas!",
      };
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const encryptedToken = CryptoJS.AES.encrypt(
      JSON.stringify({
        id: student.id,
        name: student.name,
        birth_date: student.birth_date,
        position: student.position,
        class: {
          index: student.class?.index,
          name: student.class?.name,
        },
      }),
      SECRET_KEY
    ).toString();
    (await cookies()).set("access_token", encryptedToken, {
      expires,
      httpOnly: true,
      sameSite: "lax",
    });

    return {
      success: true,
      message: "Usuário logado com sucesso!",
    };
  } catch (e: unknown) {
    console.error("Error logging in:", e);
    throw new Error("Erro ao logar usuário");
  }
}

export async function signOut(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await clearToken();

    return {
      success: true,
      message: "Usuário deslogado com sucesso!",
    };
  } catch (e: unknown) {
    console.error("Error logging out:", e);
    throw new Error("Erro ao deslogar usuário");
  }
}
