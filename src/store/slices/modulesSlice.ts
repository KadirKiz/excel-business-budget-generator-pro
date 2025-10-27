import { create } from 'zustand';
import type { ModuleConfig } from '../../types/finance';

interface ModulesSlice extends ModuleConfig {
  toggleModule: (module: keyof ModuleConfig) => void;
  updateModuleConfig: <K extends keyof ModuleConfig>(
    module: K,
    config: Partial<ModuleConfig[K]>
  ) => void;
}

const initialState: ModuleConfig = {
  cashflow: {
    enabled: false,
    balanceDate: new Date(),
  },
  debts: {
    enabled: false,
  },
  savings: {
    enabled: false,
    goals: [],
  },
  netWorth: {
    enabled: false,
  },
};

export const useModulesStore = create<ModulesSlice>((set) => ({
  ...initialState,
  toggleModule: (module) => set((state) => ({
    [module]: {
      ...state[module],
      enabled: !state[module].enabled,
    },
  })),
  updateModuleConfig: (module, config) => set((state) => ({
    [module]: {
      ...state[module],
      ...config,
    },
  })),
}));

