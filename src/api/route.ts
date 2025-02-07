import Papa from 'papaparse';

interface CsvData {
  [key: string]: string | number;
}

interface ParseResponse {
  data: CsvData[];
}

interface RequestBody {
  file: string;
}

export default function handler(
  req: { method: string; body: RequestBody },
  res: {
    status: (code: number) => {
      json: (data: { error?: string; data?: CsvData[] }) => void;
    };
  }
) {
  if (req.method === 'POST') {
    const file = req.body.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    Papa.parse(file, {
      header: true,
      complete: (results: ParseResponse) => {
        res.status(200).json({ data: results.data });
      },
      error: (error: Error) => {
        res.status(500).json({ error: 'Erro ao processar o arquivo.' });
      },
    });
  } else {
    res.status(405).json({ error: 'Método não permitido.' });
  }
}