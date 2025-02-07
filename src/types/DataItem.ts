export interface DataItem {
  STATUS: string;
  ORIGEM: string;
  PROTOCOLO: string;
  ATENDENTE: string;
  DEPARTAMENTO: string;
  MOTIVO: string;
  NOME: string;
  NUMERO: string;
  DATA: string;
  DATAFINALIZACAO: string;
  DATAULTIMAMENSAGEM: string;
  POSSUIANEXO: string;
  AVALIACAO: string;
  TAGS?: string;
  DIAS_SEM_CONTATO?: number;
  DIAS_TOTAL?: number;
}