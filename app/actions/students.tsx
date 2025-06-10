"use server";

import { getDoc } from "@/services/google-spreadsheets";
import { Student } from "@/types/Student";

/**
 * Função para buscar as turmas disponíveis em um bimestre específico.
 * @param bimestre - O bimestre para o qual as turmas devem ser buscadas (default é 1).
 * @returns Uma lista de objetos representando as turmas, cada um com um índice e título.
 */
export async function fetchClasses(bimestre: number = 1) {
  try {
    const doc = getDoc(bimestre);
    await doc.loadInfo();
    const classes: {
      index: number;
      title: string;
    }[] = [];

    for (let i = 0; i < doc.sheetCount - 1; i++) {
      const sheet = doc.sheetsByIndex[i];
      classes.push({
        index: i,
        title: sheet.title,
      });
    }

    return classes;
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return [];
  }
}

/**
 * Função para buscar os estudantes de uma turma específica em um bimestre.
 * @param classIndex - O índice da turma para a qual os estudantes devem ser buscados.
 * @param bimestre - O bimestre para o qual os estudantes devem ser buscados (default é 1).
 * @returns Uma lista de objetos representando os estudantes, cada um com id, data de nascimento, nome, posição e informações da turma.
 */
export async function fetchStudents(classIndex: number, bimestre: number = 1) {
  try {
    const doc = getDoc(bimestre);
    await doc.loadInfo();

    if (classIndex < 0 || classIndex >= doc.sheetCount) {
      throw new Error("Índice de classe inválido");
    }

    const sheet = doc.sheetsByIndex[classIndex];
    const data: string[][] = await sheet.getCellsInRange("A4:D100");

    const students = data
      .map((student: string[], index) => {
        if (!student[1] || !student[2] || !student[3]) {
          return null;
        }
        return {
          id: student[1],
          birth_date: student[2],
          name: student[3],
          position: index + 4,
          class: {
            index: classIndex,
            name: sheet.title,
          },
        };
      })
      .filter((student) => student !== null) as Student[];

    return students;
  } catch (error) {
    console.error("Erro ao buscar estudantes:", error);
    return [];
  }
}
