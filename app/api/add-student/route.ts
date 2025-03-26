import { NextResponse } from "next/server";
import { doc } from "@/services/google-spreadsheets"; // A mesma configuração de serviço que você já tem

export async function POST(request: Request) {
  const { nome, matricula } = await request.json();

  try {
    // Carregar a planilha
    await doc.loadInfo();

    // Acessar a planilha de estudantes (assumindo que é a primeira planilha)
    const sheet = doc.sheetsByIndex[0];

    // Adicionar um novo registro (linha)
    await sheet.addRow({ nome, matricula });

    // Retornar uma resposta de sucesso
    return NextResponse.json({ message: "Estudante adicionado com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao adicionar estudante." }, { status: 500 });
  }
}