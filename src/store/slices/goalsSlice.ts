import { create } from 'zustand';
import type { Transaction } from '../../types/finance';

export interface Goal {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'savings' | 'profit';
  target: number;
  current: number;
  startDate: Date;
  deadline: Date;
  categoryId?: string;
  progress: number; // 0-100
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  description?: string;
}

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  updateGoalsProgress: (transactions: Transaction[]) => void;
  selectActiveGoals: () => Goal[];
  selectGoalsByType: (type: Goal['type']) => Goal[];
  selectGoalsByCategory: (categoryId: string) => Goal[];
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal],
  })),
  
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map((g) =>
      g.id === id ? { ...g, ...updates } : g
    ),
  })),
  
  removeGoal: (id) => set((state) => ({
    goals: state.goals.filter((g) => g.id !== id),
  })),
  
  updateGoalsProgress: (transactions) => set((state) => {
    const updatedGoals = state.goals.map((goal) => {
      // Filter relevant transactions based on date range and optional category
      const relevantTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        const isInRange = txDate >= new Date(goal.startDate) && txDate <= new Date(goal.deadline);
        const matchesCategory = !goal.categoryId || tx.category === goal.categoryId;
        return isInRange && matchesCategory;
      });

      let current = 0;
      
      if (goal.type === 'savings') {
        // Savings: Income - Expense
        const income = relevantTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = relevantTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        current = income - expense;
      } else if (goal.type === 'revenue') {
        current = relevantTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      } else if (goal.type === 'expense') {
        current = relevantTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      } else if (goal.type === 'profit') {
        const income = relevantTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = relevantTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        current = income - expense;
      }

      const progress = Math.min(100, Math.max(0, (current / goal.target) * 100));
      
      // Determine status
      let status: Goal['status'] = 'on-track';
      if (progress >= 100) {
        status = 'completed';
      } else {
        const now = new Date();
        const deadline = new Date(goal.deadline);
        const totalDays = Math.floor((deadline.getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24));
        const elapsedDays = Math.floor((now.getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24));
        const expectedProgress = (elapsedDays / totalDays) * 100;
        
        if (progress < expectedProgress - 20) {
          status = 'behind';
        } else if (progress < expectedProgress - 10) {
          status = 'at-risk';
        }
      }

      return { ...goal, current, progress, status };
    });

    return { goals: updatedGoals };
  }),
  
  selectActiveGoals: () => {
    const state = get();
    return state.goals.filter((g) => g.status !== 'completed');
  },
  
  selectGoalsByType: (type) => {
    const state = get();
    return state.goals.filter((g) => g.type === type);
  },
  
  selectGoalsByCategory: (categoryId) => {
    const state = get();
    return state.goals.filter((g) => g.categoryId === categoryId);
  },
}));

