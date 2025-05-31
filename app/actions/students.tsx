"use server";

import { getDoc } from "@/services/google-spreadsheets";
import { Student } from "@/types/Student";

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
    throw new Error("Erro ao buscar turmas: " + error);
  }
}

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
    throw new Error("Erro ao buscar estudantes: " + error);
  }
}
