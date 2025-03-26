import { NextResponse } from "next/server";
import { doc } from "@/services/google-spreadsheets"; // Adaptar para onde está a lógica para pegar os dados da planilha
import { Student } from "@/types/Student"; // Certifique-se de que você tem esse tipo

export async function GET(req: Request) {
  try {
    const { matricula } = await req.json();
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Procurando o estudante pela matrícula
    const studentRow = rows.find((row) => row.get("matricula") === matricula);

    if (!studentRow) {
      return NextResponse.json(
        { error: "Estudante não encontrado." },
        { status: 404 }
      );
    }

    // Extraindo as informações do estudante
    const student: Student = {
      matricula: studentRow.get("matricula"),
      nome: studentRow.get("nome"),
    };

    return NextResponse.json(student);
  } catch (error) {
    console.error("Erro ao buscar estudante:", error);
    return NextResponse.json(
      { error: "Erro ao buscar o estudante." },
      { status: 500 }
    );
  }
}
