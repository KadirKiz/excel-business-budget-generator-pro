import localforage from 'localforage';
import { saveAs } from 'file-saver';
import type { AppConfig, Transaction, Category, BudgetPlan } from '../types/finance';
import type { Alert } from './alerts';

const STORAGE_KEY = 'ebbgp_state_v1';
const STORAGE_VERSION = 1;

export interface PersistState {
  version: number;
  appConfig?: AppConfig;
  data?: {
    transactions: Transaction[];
    categories: Category[];
    budgets: BudgetPlan[];
  };
  modules?: {
    cashflow: { enabled: boolean; balanceDate: Date };
    debts: { enabled: boolean };
    savings: { enabled: boolean; goals: any[] };
    netWorth: { enabled: boolean };
  };
  alerts?: Alert[];
  lastSaved?: string;
}

// Initialize localforage
localforage.config({
  name: 'ExcelBudgetApp',
  storeName: 'state',
  description: 'Excel Business Budget Generator Pro state storage',
});

/**
 * Save application state
 */
export async function saveAppState(state: PersistState): Promise<void> {
  try {
    const data = {
      ...state,
      lastSaved: new Date().toISOString(),
    };
    await localforage.setItem(STORAGE_KEY, data);
    console.log('State saved successfully');
  } catch (error) {
    console.error('Error saving state:', error);
    throw error;
  }
}

/**
 * Load application state
 */
export async function loadAppState(): Promise<PersistState | null> {
  try {
    const state = await localforage.getItem<PersistState>(STORAGE_KEY);
    if (!state) return null;

    // Migration check
    if (state.version !== STORAGE_VERSION) {
      console.warn(`State version mismatch. Expected ${STORAGE_VERSION}, got ${state.version}`);
      // Future: implement migration logic here
    }

    // Deserialize dates
    if (state.data) {
      state.data.transactions = state.data.transactions.map((tx) => ({
        ...tx,
        date: new Date(tx.date),
      }));
      state.data.budgets = state.data.budgets.map((budget) => ({
        ...budget,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      }));
    }

    if (state.modules?.cashflow?.balanceDate) {
      state.modules.cashflow.balanceDate = new Date(state.modules.cashflow.balanceDate);
    }

    if (state.alerts) {
      state.alerts = state.alerts.map((alert) => ({
        ...alert,
        createdAt: alert.createdAt,
      }));
    }

    return state;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
}

/**
 * Clear application state
 */
export async function clearAppState(): Promise<void> {
  try {
    await localforage.removeItem(STORAGE_KEY);
    console.log('State cleared');
  } catch (error) {
    console.error('Error clearing state:', error);
    throw error;
  }
}

/**
 * Export state as JSON file
 */
export async function exportAppStateAsFile(filename?: string): Promise<void> {
  try {
    const state = await loadAppState();
    if (!state) {
      throw new Error('No state to export');
    }

    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const fileName = filename || `ebbgp_backup_${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error exporting state:', error);
    throw error;
  }
}

/**
 * Import state from JSON file
 */
export async function importAppStateFromFile(file: File): Promise<PersistState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const state = JSON.parse(json) as PersistState;

        // Validate structure
        if (!state.version || !state.data) {
          throw new Error('Invalid backup file format');
        }

        // Deserialize dates
        if (state.data.transactions) {
          state.data.transactions = state.data.transactions.map((tx) => ({
            ...tx,
            date: new Date(tx.date),
          }));
        }

        if (state.data.budgets) {
          state.data.budgets = state.data.budgets.map((budget) => ({
            ...budget,
            startDate: new Date(budget.startDate),
            endDate: new Date(budget.endDate),
          }));
        }

        if (state.modules?.cashflow?.balanceDate) {
          state.modules.cashflow.balanceDate = new Date(state.modules.cashflow.balanceDate);
        }

        resolve(state);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Debounce helper
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

