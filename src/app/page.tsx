"use client";

import { useState } from "react";
import FileUpload from "./components/FileUpload";
import { Table } from "./components/Table";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Dashboard de Atendimentos</h1>
        </div>
      </header>
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Upload de Arquivo</h2>
            <FileUpload onFileProcessed={setData} />
          </div>
          {data.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Tabela</h2>
              <Table data={data} />
            </div>
          )}
        </div>
      </main>
      <footer className="bg-blue-600 text-white p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>
            &copy; 2025 Dashboard de Atendimentos. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
