"use server";

import { cookies } from "next/headers";
import CryptoJS from "crypto-js";
import { LoginSchema } from "@/lib/validations/login";
import { fetchStudents } from "@/app/actions/students";
import { formatDate } from "date-fns";

const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

/**
 * Recupera o token de acesso criptografado armazenado em cookie.
 *
 * Descriptografa o token usando a chave secreta definida em AUTH_SECRET_KEY.
 *
 * @returns O token de acesso original ou null se não houver token armazenado.
 */
export async function getToken(): Promise<string | null> {
  const encryptedToken = (await cookies()).get("access_token")?.value;
  if (encryptedToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);
    return originalToken;
  }
  return null;
}

/**
 * Limpa o token de acesso removendo-o do cookie.
 *
 * Define o cookie "access_token" com uma data de expiração no passado,
 * efetivamente removendo-o.
 */
export async function clearToken(): Promise<void> {
  (await cookies()).set("access_token", "", { expires: new Date(0) });
}

/**
 * Realiza o login de um aluno verificando suas credenciais (id, data de nascimento e turma).
 *
 * Busca os alunos da turma informada, valida as credenciais fornecidas e,
 * em caso de sucesso, gera e armazena um token de acesso criptografado em cookie.
 *
 * @param data - Objeto contendo as informações de login do aluno (id, data de nascimento e turma).
 * @returns Um objeto indicando se o login foi bem-sucedido e uma mensagem correspondente.
 */
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
    return {
      success: false,
      message: "Erro ao realizar login. Verifique suas credenciais.",
    };
  }
}

/**
 * Realiza o logout do usuário, limpando o token de acesso armazenado em cookie.
 *
 * Remove o cookie "access_token" para efetivar o logout do usuário.
 * @return Um objeto indicando se o logout foi bem-sucedido e uma mensagem correspondente.
 * */
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
    return {
      success: false,
      message: "Erro ao realizar logout. Tente novamente.",
    };
  }
}
