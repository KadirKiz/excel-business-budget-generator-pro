import { create } from 'zustand';
import type { ExportSession } from '../../types/finance';
import type { ExportBranding } from '../../lib/export';

interface ExportSlice extends ExportSession {
  sheets: ('transactions' | 'categories' | 'budgets' | 'summary')[];
  
  setTarget: (target: ExportSession['target']) => void;
  setBranding: (branding: ExportBranding) => void;
  setSheets: (sheets: ('transactions' | 'categories' | 'budgets' | 'summary')[]) => void;
  setProgress: (progress: number) => void;
  setResultLink: (link: string) => void;
  setStatus: (status: ExportSession['status']) => void;
  reset: () => void;
}

const initialState: ExportSession & { sheets: ('transactions' | 'categories' | 'budgets' | 'summary')[] } = {
  target: 'excel',
  branding: {},
  progress: 0,
  status: 'idle',
  sheets: ['transactions', 'categories', 'budgets', 'summary'],
};

export const useExportStore = create<ExportSlice>((set) => ({
  ...initialState,
  setTarget: (target) => set({ target }),
  setBranding: (branding) => set({ branding }),
  setSheets: (sheets) => set({ sheets }),
  setProgress: (progress) => set({ progress }),
  setResultLink: (link) => set({ resultLink: link }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

