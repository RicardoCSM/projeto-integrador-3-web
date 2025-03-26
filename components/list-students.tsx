"use client";

import React from "react";
import { Student } from "@/types/Student";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

interface ListStudentsProps {
  students: Student[];
}

const ListStudents: React.FC<ListStudentsProps> = ({ students }) => {
  // Função para deletar o estudante com confirmação
  const deleteStudent = async (matricula: string) => {
    // Confirmação antes de deletar
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este estudante?");
    if (!confirmDelete) return; // Se o usuário cancelar, nada acontece

    // Se confirmado, faz a requisição de deletação
    const response = await fetch("/api/delete-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matricula }),
    });

    if (response.ok) {
      alert("Estudante deletado com sucesso!");
      // Atualizar a lista de estudantes após a exclusão
      // Aqui, você pode utilizar a mesma lógica para remover o estudante da lista, por exemplo
    } else {
      alert("Erro ao deletar o estudante.");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 w-full">
      {students.map((student) => (
        <Card key={student.matricula} className="w-[350px]">
          <CardHeader>
            <CardTitle>{student.nome}</CardTitle>
            <CardDescription>{student.matricula}</CardDescription>
          </CardHeader>

          <div className="p-4 flex justify-between items-center">
            <Link
              href={`/edit/${student.matricula}`} // Link para editar o estudante
              className="w-1/3 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 text-center"
            >
              Editar
            </Link>

            <button
              onClick={() => deleteStudent(student.matricula)} // Chama a função de deletar com a matrícula
              className="w-1/3 py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 text-center"
            >
              Deletar
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListStudents;


