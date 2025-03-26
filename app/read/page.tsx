import ListStudents from "@/components/list-students";
import fetchStudents from "../actions/fetch-students";
import Link from "next/link"; // Importando o Link do Next.js

const Read = async () => {
  const students = await fetchStudents();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Lista de Estudantes</h1>

      {/* Mostrar a lista de estudantes */}
      {students && (
        <div className="space-y-4">
          <ListStudents students={students} />
        </div>
      )}

      {/* Botão de Voltar para a Página Principal */}
      <Link href="/" className="mt-8 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
        Voltar
      </Link>
    </div>
  );
}

export default Read;


