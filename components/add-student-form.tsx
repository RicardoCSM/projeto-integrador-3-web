"use client";

import { useState } from "react";

// Defina a função que irá lidar com a submissão dos dados
const AddStudentForm = () => {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Envia os dados para o servidor
    const response = await fetch("/api/add-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, matricula }),
    });

    if (response.ok) {
      alert("Estudante adicionado com sucesso!");
      setNome(""); // Limpa os campos após o envio
      setMatricula("");
    } else {
      alert("Erro ao adicionar estudante.");
    }
  };

  return (
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
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
      >
        Adicionar Estudante
      </button>
    </form>
  );
};

export default AddStudentForm;
