import { saveAppState, loadAppState, type PersistState } from '../lib/persistence';
import { useAppConfigStore } from './slices/appConfigSlice';
import { useDataStore } from './slices/dataSlice';
import { useModulesStore } from './slices/modulesSlice';
import { useAlertsStore } from './slices/alertsSlice';
import { useGoalsStore } from './slices/goalsSlice';
import { useRecurringStore } from './slices/recurringSlice';
import { useDebtsStore } from './slices/debtsSlice';
import { debounce } from '../lib/persistence';

/**
 * Load persisted state on app start
 */
export async function hydrateStores(): Promise<void> {
  const persisted = await loadAppState();
  if (!persisted) return;

  // Restore appConfig
  if (persisted.appConfig) {
    useAppConfigStore.getState().updateConfig(persisted.appConfig);
  }

  // Restore data
  if (persisted.data) {
    useDataStore.setState({
      transactions: persisted.data.transactions,
      categories: persisted.data.categories,
      budgets: persisted.data.budgets,
    });
  }

  // Restore modules
  if (persisted.modules) {
    useModulesStore.setState(persisted.modules);
  }

  // Restore alerts
  if (persisted.alerts) {
    useAlertsStore.setState({ alerts: persisted.alerts });
  }

  // Restore goals
  if (persisted.goals) {
    useGoalsStore.setState({ goals: persisted.goals });
  }

  // Restore recurrings
  if (persisted.recurrings) {
    useRecurringStore.setState({ recurrings: persisted.recurrings });
  }

  // Restore debts
  if (persisted.debts) {
    useDebtsStore.setState({ debts: persisted.debts });
  }

  console.log('Stores hydrated from persisted state');
  console.log('Goals restored:', persisted.goals?.length || 0);
  console.log('Recurrings restored:', persisted.recurrings?.length || 0);
  console.log('Debts restored:', persisted.debts?.length || 0);
}

/**
 * Save current state (called by subscription)
 */
const debouncedSave = debounce(async () => {
  const state: PersistState = {
    version: 4,
    appConfig: useAppConfigStore.getState(),
    data: {
      transactions: useDataStore.getState().transactions,
      categories: useDataStore.getState().categories,
      budgets: useDataStore.getState().budgets,
    },
    modules: {
      cashflow: useModulesStore.getState().cashflow,
      debts: useModulesStore.getState().debts,
      savings: useModulesStore.getState().savings,
      netWorth: useModulesStore.getState().netWorth,
    },
    alerts: useAlertsStore.getState().alerts,
    goals: useGoalsStore.getState().goals,
    recurrings: useRecurringStore.getState().recurrings,
    debts: useDebtsStore.getState().debts,
  };

  await saveAppState(state);
}, 1000); // 1 second debounce

/**
 * Setup auto-save subscriptions
 */
export function setupAutoSave(): () => void {
  const unsubscribeConfig = useAppConfigStore.subscribe(() => {
    debouncedSave();
  });

  const unsubscribeData = useDataStore.subscribe(() => {
    debouncedSave();
  });

  const unsubscribeModules = useModulesStore.subscribe(() => {
    debouncedSave();
  });

  const unsubscribeAlerts = useAlertsStore.subscribe(() => {
    debouncedSave();
  });

  const unsubscribeGoals = useGoalsStore.subscribe(() => {
    debouncedSave();
  });

  const unsubscribeRecurrings = useRecurringStore.subscribe(() => {
    debouncedSave();
  });

  const unsubscribeDebts = useDebtsStore.subscribe(() => {
    debouncedSave();
  });

  // Return cleanup function
  return () => {
    unsubscribeConfig();
    unsubscribeData();
    unsubscribeModules();
    unsubscribeAlerts();
    unsubscribeGoals();
    unsubscribeRecurrings();
    unsubscribeDebts();
  };
}

