/**
 * Finance Types für Excel Business Budget Generator Pro
 */

export type CurrencyCode = 'CHF' | 'EUR' | 'USD' | 'GBP';
export type LocaleCode = 'de-CH' | 'en-US' | 'fr-CH' | 'it-CH';
export type Purpose = 'private' | 'freelancer' | 'small-business' | 'enterprise';

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  currency: CurrencyCode;
  category: string;
  description: string;
  type: 'income' | 'expense';
  source?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense' | 'both';
  budgetLimit?: number;
}

export interface BudgetPlan {
  id: string;
  name: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  categories: {
    categoryId: string;
    budgeted: number;
  }[];
  actual?: number;
}

export interface Variance {
  id: string;
  budgetId: string;
  categoryId: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  period: string;
}

export interface AppConfig {
  country: string;
  locale: LocaleCode;
  currency: CurrencyCode;
  purpose: Purpose;
  designMode: 'tech';
  companyName?: string;
  logoUrl?: string;
  fiscalStartMonth?: number;
  fiscalStartDay?: number;
  liquidityThreshold?: number;
  unusualExpenseMultiplier?: number;
  budgetCriticalPct?: number;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute?: string;
}

export interface ModuleConfig {
  cashflow: {
    enabled: boolean;
    balanceDate: Date;
  };
  debts: {
    enabled: boolean;
  };
  savings: {
    enabled: boolean;
    goals: Array<{ name: string; target: number; date: Date }>;
  };
  netWorth: {
    enabled: boolean;
  };
}

export interface DataState {
  transactions: Transaction[];
  categories: Category[];
  budgets: BudgetPlan[];
}

export interface ImportSession {
  source: 'excel' | 'csv' | 'bank' | 'manual';
  mapping: Record<string, string>;
  progress: number;
  errors: string[];
  status: 'idle' | 'mapping' | 'importing' | 'completed' | 'error';
}

export interface ExportSession {
  target: 'excel' | 'pdf' | 'csv';
  branding: {
    logo?: string;
    colors?: string[];
  };
  progress: number;
  status: 'idle' | 'preparing' | 'generating' | 'completed' | 'error';
  resultLink?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

