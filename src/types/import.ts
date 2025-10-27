export type CsvRawRow = Record<string, string>;

export interface ImportMapping {
  date: string;
  description: string;
  amount: string;
  category?: string;
  type?: 'income' | 'expense' | string;
}

export interface ImportResult {
  ok: number;
  failed: number;
  errors: Array<{ row: number; reason: string }>;
}

