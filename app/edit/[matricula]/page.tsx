"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Usando o hook correto do Next.js 13 para pegar parâmetros
import { Student } from "@/types/Student";
import Link from "next/link";

const EditStudent = () => {
  const { matricula } = useParams(); // Acessando a matrícula da URL
  const [student, setStudent] = useState<Student | null>(null);
  const [nome, setNome] = useState("");
  const [matriculaInput, setMatriculaInput] = useState("");

  // Buscar os dados do estudante com a matrícula recebida
  useEffect(() => {
    const fetchStudent = async () => {
      if (!matricula) return;

      const response = await fetch(`/api/get-student/${matricula}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setNome(data.nome);
        setMatriculaInput(data.matricula);
      } else {
        alert("Estudante não encontrado.");
      }
    };

    fetchStudent();
  }, [matricula]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Atualizar o estudante
    const response = await fetch(`/api/update-student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, matricula: matriculaInput }),
    });

    if (response.ok) {
      alert("Dados atualizados com sucesso!");
      // Redireciona para a página de leitura após atualização
      window.location.href = "/read"; // Pode usar o router.push também se necessário
    } else {
      alert("Erro ao atualizar os dados.");
    }
  };

  if (!student) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Editar Estudante</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">
            Matrícula
          </label>
          <input
            type="text"
            id="matricula"
            value={matriculaInput}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
        >
          Atualizar Estudante
        </button>
      </form>

      {/* Botão de Voltar para a Página Principal */}
      <Link href="/" className="mt-8 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
        Voltar
      </Link>
    </div>
  );
};

export default EditStudent;


