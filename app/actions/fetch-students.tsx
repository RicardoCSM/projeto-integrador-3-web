"use server";

import { doc } from "@/services/google-spreadsheets";
import { Student } from "@/types/Student";

export default async function fetchStudents() {
  try {
    // Carregando a planilha
    await doc.loadInfo();

    // Selecionando a primeira planilha
    const sheet = doc.sheetsByIndex[0];

    // Obtendo as linhas da planilha
    const rows = await sheet.getRows();

    // Mapeando as linhas para a estrutura de estudantes
    const students: Student[] = rows.map((row) => ({
      matricula: row.get("matricula"),
      nome: row.get("nome"),
    }));

    return students;
  } catch (error) {
    console.error(error);
    return [];
  }
}

