import { create } from 'zustand';
import type { DataState, Transaction, Category, BudgetPlan } from '../../types/finance';
import { demoCategories, generateDemoTransactions, generateDemoBudgets } from '../../mock/fixtures';
import { aggregateByMonth, variance, categoryTotals } from '../../lib/compute';
import { evaluateAlerts } from '../../lib/alerts';
import { useAppConfigStore } from './appConfigSlice';
import { useAlertsStore } from './alertsSlice';

interface DataSlice extends DataState {
  // Actions
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  deleteCategory: (id: string) => void; // Alias for removeCategory
  updateCategory: (id: string, updates: Partial<Category>) => void;
  addBudget: (budget: BudgetPlan) => void;
  removeBudget: (id: string) => void;
  updateBudget: (id: string, updates: Partial<BudgetPlan>) => void;
  importData: (data: Partial<DataState>) => void;
  clearAll: () => void;
  loadDemoData: () => void;
  
  // Selectors
  selectMonthlyAgg: () => Record<string, { income: number; expense: number; balance: number }>;
  selectVariance: () => Array<{ categoryId: string; month: string; plan: number; actual: number; diff: number; diffPct: number }>;
  selectCategoryTotals: () => Array<{ categoryId: string; total: number }>;
  selectCategoryIndex: () => Record<string, string>;
  commitImportedTransactions: (transactions: Transaction[]) => void;
}

const initialState: DataState = {
  transactions: [],
  categories: [],
  budgets: [],
};

export const useDataStore = create<DataSlice>((set) => ({
  ...initialState,
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, transaction],
  })),
  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id),
  })),
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    ),
  })),
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, category],
  })),
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
  })),
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
  })),
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    ),
  })),
  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, budget],
  })),
  removeBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((b) => b.id !== id),
  })),
  updateBudget: (id, updates) => set((state) => ({
    budgets: state.budgets.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    ),
  })),
  importData: (data) => set((state) => ({
    transactions: data.transactions ?? state.transactions,
    categories: data.categories ?? state.categories,
    budgets: data.budgets ?? state.budgets,
  })),
  clearAll: () => set(initialState),
  loadDemoData: () => {
    const transactions = generateDemoTransactions();
    const budgets = generateDemoBudgets(demoCategories);
    set({
      categories: demoCategories,
      transactions,
      budgets,
    });
    
    // Trigger alerts evaluation
    setTimeout(() => {
      const state = useDataStore.getState();
      const config = useAppConfigStore.getState();
      const alerts = evaluateAlerts({
        transactions: state.transactions,
        budgets: state.budgets,
        categories: state.categories,
        appConfig: config,
      });
      useAlertsStore.getState().setAlerts(alerts);
    }, 100);
  },
  selectMonthlyAgg: () => {
    const state = useDataStore.getState();
    return aggregateByMonth(state.transactions);
  },
  selectVariance: () => {
    const state = useDataStore.getState();
    return variance(state.budgets, state.transactions);
  },
  selectCategoryTotals: () => {
    const state = useDataStore.getState();
    return categoryTotals(state.transactions);
  },
  selectCategoryIndex: () => {
    const state = useDataStore.getState();
    const index: Record<string, string> = {};
    state.categories.forEach((cat) => {
      index[cat.name.toLowerCase()] = cat.id;
    });
    return index;
  },
  commitImportedTransactions: (transactions) => {
    set((state) => {
      // Simple duplicate check: date + amount + description
      const existing = new Set(state.transactions.map((t) => 
        `${t.date.getTime()}|${t.amount}|${t.description}`
      ));
      
      const unique = transactions.filter((t) => 
        !existing.has(`${t.date.getTime()}|${t.amount}|${t.description}`)
      );
      
      return {
        transactions: [...state.transactions, ...unique],
      };
    });
    
    // Trigger alerts evaluation
    setTimeout(() => {
      const state = useDataStore.getState();
      const config = useAppConfigStore.getState();
      const alerts = evaluateAlerts({
        transactions: state.transactions,
        budgets: state.budgets,
        categories: state.categories,
        appConfig: config,
      });
      useAlertsStore.getState().setAlerts(alerts);
    }, 100);
  },
}));

