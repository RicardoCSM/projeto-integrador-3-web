import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-6">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold mb-4">Escolha uma opção:</h1>
        
        {/* Menu de navegação */}
        <div className="space-y-4">
          <Link href="/read" className="block text-center py-2 px-4 bg-blue-500 text-white rounded-md">
            Ler dados do Google Sheets
          </Link>
          <Link href="/write" className="block text-center py-2 px-4 bg-green-500 text-white rounded-md">
            Adicionar dados ao Google Sheets
          </Link>
        </div>
      </div>
    </div>
  );
}



