"use server";

import { doc } from "@/services/google-spreadsheets";
import { Student } from "@/types/Student";

export async function fetchStudents() {
  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
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
        };
      })
      .filter((student) => student !== null) as Student[];

    return students;
  } catch (error) {
    throw new Error("Erro ao buscar estudantes: " + error);
  }
}
