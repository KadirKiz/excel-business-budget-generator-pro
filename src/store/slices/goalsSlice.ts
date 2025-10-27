import { create } from 'zustand';

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

