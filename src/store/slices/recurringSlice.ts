import { create } from 'zustand';

export interface RecurringTransaction {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  currency: 'CHF' | 'EUR' | 'USD' | 'GBP';
  category: string;
  description: string;
  type: 'income' | 'expense';
  startDate: Date;
  endDate?: Date;
  nextOccurrence: Date;
  isActive: boolean;
  lastGenerated?: Date;
  generatedCount: number;
}

interface RecurringState {
  recurrings: RecurringTransaction[];
  addRecurring: (recurring: RecurringTransaction) => void;
  updateRecurring: (id: string, updates: Partial<RecurringTransaction>) => void;
  removeRecurring: (id: string) => void;
  toggleActive: (id: string) => void;
  selectActiveRecurrings: () => RecurringTransaction[];
  selectDueRecurrings: (currentDate: Date) => RecurringTransaction[];
}

export const useRecurringStore = create<RecurringState>((set, get) => ({
  recurrings: [],
  
  addRecurring: (recurring) => set((state) => ({
    recurrings: [...state.recurrings, recurring],
  })),
  
  updateRecurring: (id, updates) => set((state) => ({
    recurrings: state.recurrings.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    ),
  })),
  
  removeRecurring: (id) => set((state) => ({
    recurrings: state.recurrings.filter((r) => r.id !== id),
  })),
  
  toggleActive: (id) => set((state) => ({
    recurrings: state.recurrings.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ),
  })),
  
  selectActiveRecurrings: () => {
    const state = get();
    return state.recurrings.filter((r) => r.isActive);
  },
  
  selectDueRecurrings: (currentDate) => {
    const state = get();
    return state.recurrings.filter((r) => {
      if (!r.isActive) return false;
      if (r.endDate && new Date(r.endDate) < currentDate) return false;
      return new Date(r.nextOccurrence) <= currentDate;
    });
  },
}));

