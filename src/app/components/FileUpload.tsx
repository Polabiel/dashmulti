import { useCallback, useState } from "react";
import Papa from "papaparse";

type FileUploadProps = {
  onFileProcessed: (data: any[]) => void;
};

export default function FileUpload({
  onFileProcessed,
}: Readonly<FileUploadProps>) {
  const [error, setError] = useState<string | null>(null);

  interface ParseResult {
    data: any[];
    errors: Papa.ParseError[];
  }

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      Papa.parse<any>(file, {
        header: true,
        dynamicTyping: true,
        complete: (results: ParseResult) => {
          if (results.errors.length > 0) {
            setError("Erro ao processar o arquivo.");
          } else {
            onFileProcessed(results.data);
            setError(null);
          }
        },
      });
    },
    [onFileProcessed]
  );

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Carregar CSV
      </label>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
