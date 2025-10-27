import { create } from 'zustand';
import type { AppConfig, LocaleCode, CurrencyCode } from '../../types/finance';

interface AppConfigState extends AppConfig {
  // Actions
  updateConfig: (config: Partial<AppConfig>) => void;
  resetConfig: () => void;
  
  // Selectors
  selectLocaleCurrency: () => { locale: LocaleCode; currency: CurrencyCode };
}

const defaultConfig: AppConfig = {
  country: 'CH',
  locale: 'de-CH',
  currency: 'CHF',
  purpose: 'private',
  designMode: 'tech',
  fiscalStartMonth: 1,
  fiscalStartDay: 1,
  liquidityThreshold: 0,
  unusualExpenseMultiplier: 3,
  budgetCriticalPct: 0.2,
};

export const useAppConfigStore = create<AppConfigState>((set) => ({
  ...defaultConfig,
  updateConfig: (config) => set((state) => ({ ...state, ...config })),
  resetConfig: () => set(defaultConfig),
  selectLocaleCurrency: () => {
    const state = useAppConfigStore.getState();
    return { locale: state.locale, currency: state.currency };
  },
}));

