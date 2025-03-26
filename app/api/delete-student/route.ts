import { doc } from "@/services/google-spreadsheets"; // Acessando o serviço do Google Sheets
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { matricula } = await req.json();

  try {
    await doc.loadInfo(); // Carregar as informações da planilha
    const sheet = doc.sheetsByIndex[0]; // Acessar a primeira planilha
    const rows = await sheet.getRows(); // Obter todas as linhas da planilha

    // Encontrar o aluno pela matrícula
    const student = rows.find((row) => row.get("matricula") === matricula);

    if (student) {
      await student.delete(); // Deletar o estudante
      return NextResponse.json({ message: "Estudante deletado com sucesso" });
    } else {
      return NextResponse.json({ error: "Estudante não encontrado" }, { status: 404 });
    }
  } catch (error) {
    console.error(error); // Log do erro
    return NextResponse.json({ error: "Erro ao deletar o estudante" }, { status: 500 });
  }
}

