import { create } from 'zustand';

export interface Debt {
  id: string;
  name: string;
  creditor: string; // Gläubiger
  totalAmount: number;
  currency: 'CHF' | 'EUR' | 'USD' | 'GBP';
  monthlyPayment: number;
  interestRate: number; // Prozent, z.B. 3.5 für 3.5%
  startDate: Date;
  endDate?: Date;
  currentBalance: number;
  status: 'active' | 'paid-off' | 'overdue' | 'negotiating';
  notes?: string;
  paymentHistory: Array<{
    date: Date;
    amount: number;
    notes?: string;
  }>;
}

interface DebtsState {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'currentBalance' | 'paymentHistory'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  addPayment: (debtId: string, amount: number, notes?: string) => void;
  selectActiveDebts: () => Debt[];
  selectTotalDebtAmount: () => number;
  selectMonthlyDebtPayments: () => number;
}

export const useDebtsStore = create<DebtsState>((set, get) => ({
  debts: [],

  addDebt: (debtData) => {
    const newDebt: Debt = {
      id: crypto.randomUUID(),
      ...debtData,
      currentBalance: debtData.totalAmount,
      paymentHistory: [],
      status: 'active',
    };
    set((state) => ({
      debts: [...state.debts, newDebt],
    }));
  },

  updateDebt: (id, updates) => {
    set((state) => ({
      debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },

  removeDebt: (id) => {
    set((state) => ({
      debts: state.debts.filter((d) => d.id !== id),
    }));
  },

  addPayment: (debtId, amount, notes) => {
    set((state) => ({
      debts: state.debts.map((debt) => {
        if (debt.id !== debtId) return debt;

        const newBalance = Math.max(0, debt.currentBalance - amount);
        const newPaymentHistory = [
          ...debt.paymentHistory,
          {
            date: new Date(),
            amount,
            notes,
          },
        ];

        // Auto-update status
        let status = debt.status;
        if (newBalance === 0 && debt.status === 'active') {
          status = 'paid-off';
        }

        return {
          ...debt,
          currentBalance: newBalance,
          paymentHistory: newPaymentHistory,
          status,
        };
      }),
    }));
  },

  selectActiveDebts: () => {
    return get().debts.filter((d) => d.status === 'active');
  },

  selectTotalDebtAmount: () => {
    return get().debts
      .filter((d) => d.status === 'active')
      .reduce((sum, d) => sum + d.currentBalance, 0);
  },

  selectMonthlyDebtPayments: () => {
    return get().debts
      .filter((d) => d.status === 'active')
      .reduce((sum, d) => sum + d.monthlyPayment, 0);
  },
}));

