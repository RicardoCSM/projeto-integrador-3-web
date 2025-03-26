import { doc } from "@/services/google-spreadsheets"; // Importa o objeto que tem acesso à planilha
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { matricula, nome } = await req.json();

  try {
    await doc.loadInfo(); // Carrega as informações da planilha
    const sheet = doc.sheetsByIndex[0]; // Acessa a primeira planilha
    const rows = await sheet.getRows(); // Obtém todas as linhas da planilha

    // Logs para depuração
    console.log("Buscando o estudante com matrícula:", matricula);

    // Buscando o aluno pela matrícula
    const student = rows.find((row) => {
      const matriculaRow = row.get("matricula"); // Acessa a célula "matricula"
      return matriculaRow === matricula; // Comparando com a matrícula fornecida
    });

    // Verificando se o estudante foi encontrado
    if (student) {
      console.log("Estudante encontrado:", student); // Log do estudante encontrado

      // Atualizando o nome do aluno de forma dinâmica
      student.set("nome", nome); // Usando o método set para atualizar dinamicamente o nome da coluna "nome"
      await student.save(); // Salva as alterações na planilha

      console.log("Dados atualizados com sucesso!"); // Log de sucesso

      return NextResponse.json({ message: "Dados atualizados com sucesso!" });
    } else {
      console.log("Estudante não encontrado!"); // Log caso o estudante não seja encontrado
      return NextResponse.json(
        { error: "Estudante não encontrado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar os dados:", error); // Log de erro
    return NextResponse.json(
      { error: "Erro ao atualizar os dados" },
      { status: 500 }
    );
  }
}
