import AddStudentForm from "@/components/add-student-form";
import Link from "next/link";

export default function Write() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Adicionar Estudante</h1>

      {/* Formulário para adicionar um estudante */}
      <AddStudentForm />

      <Link href="/" className="mt-8 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
        Voltar
      </Link>
    </div>
  );
}
