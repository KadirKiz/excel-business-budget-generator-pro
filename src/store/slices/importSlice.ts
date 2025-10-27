import { create } from 'zustand';
import type { ImportSession } from '../../types/finance';
import type { CsvRawRow, ImportMapping, ImportResult } from '../../types/import';

interface ImportSlice extends ImportSession {
  file?: File;
  headers: string[];
  rawRows: CsvRawRow[];
  mapping?: ImportMapping;
  preview: CsvRawRow[];
  result?: ImportResult;

  // Actions
  setSource: (source: ImportSession['source']) => void;
  setFile: (file?: File) => void;
  setHeaders: (headers: string[]) => void;
  setRawRows: (rows: CsvRawRow[]) => void;
  setMapping: (mapping: ImportMapping) => void;
  setPreview: (rows: CsvRawRow[]) => void;
  setProgress: (progress: number) => void;
  setResult: (result: ImportResult) => void;
  addError: (error: string) => void;
  setStatus: (status: ImportSession['status']) => void;
  reset: () => void;
}

const initialState: ImportSession & { headers: string[]; rawRows: CsvRawRow[]; preview: CsvRawRow[] } = {
  source: 'csv',
  mapping: {},
  progress: 0,
  errors: [],
  status: 'idle',
  headers: [],
  rawRows: [],
  preview: [],
};

export const useImportStore = create<ImportSlice>((set) => ({
  ...initialState,
  setSource: (source) => set({ source }),
  setFile: (file) => set({ file }),
  setHeaders: (headers) => set({ headers }),
  setRawRows: (rows) => set({ rawRows: rows, preview: rows.slice(0, 20) }),
  setMapping: (mapping) => set({ mapping }),
  setPreview: (rows) => set({ preview: rows }),
  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result }),
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

