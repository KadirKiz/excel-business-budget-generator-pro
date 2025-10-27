import type { Transaction, BudgetPlan, Category, AppConfig } from '../types/finance';

export interface Alert {
  id: string;
  kind: 'budget' | 'liquidity' | 'recurring' | 'custom';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  meta?: Record<string, any>;
  createdAt: string;
  resolved?: boolean;
}

export type AlertRule = {
  id: string;
  name: string;
  description?: string;
  check: (state: AlertState) => Alert[];
  throttleHours?: number;
};

export type AlertState = {
  transactions: Transaction[];
  budgets: BudgetPlan[];
  categories: Category[];
  appConfig: AppConfig;
};

/**
 * Default Alert Rules
 */
export const defaultRules: AlertRule[] = [
  // Budget Überschreitung
  {
    id: 'budget-overrun',
    name: 'Budget-Überschreitung',
    description: 'Warnung bei Überschreitung des Budgets',
    check: (state) => {
      const alerts: Alert[] = [];
      const monthlyData = aggregateByMonth(state.transactions);
      const criticalPct = state.appConfig.budgetCriticalPct || 0.2;

      state.budgets.forEach((budget) => {
        const monthKey = `${budget.startDate.getFullYear()}-${String(budget.startDate.getMonth() + 1).padStart(2, '0')}`;
        const monthlyIncome = monthlyData[monthKey]?.income || 0;
        const monthlyExpense = monthlyData[monthKey]?.expense || 0;

        budget.categories.forEach((catBudget) => {
          const categoryTransactions = state.transactions.filter(
            (t) => t.category === catBudget.categoryId && 
                   t.date.getFullYear() === budget.startDate.getFullYear() &&
                   t.date.getMonth() === budget.startDate.getMonth()
          );
          const actual = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
          const plan = catBudget.budgeted;
          const diff = actual - plan;

          if (diff > 0) {
            const diffPct = plan > 0 ? (diff / plan) * 100 : 0;
            const severity = diffPct > 20 ? 'critical' : 'warning';

            alerts.push({
              id: `alert-${Date.now()}-${Math.random()}`,
              kind: 'budget',
              severity,
              title: `Budget-Überschreitung: ${getCategoryName(catBudget.categoryId, state.categories)}`,
              message: `Überschreitung um ${diffPct.toFixed(1)}% (Plan: ${plan.toFixed(2)}, Ist: ${actual.toFixed(2)})`,
              meta: {
                categoryId: catBudget.categoryId,
                month: monthKey,
                plan,
                actual,
                diff,
                diffPct,
              },
              createdAt: new Date().toISOString(),
              resolved: false,
            });
          }
        });
      });

      return alerts;
    },
  },

  // Niedrige Liquidität
  {
    id: 'low-liquidity',
    name: 'Niedrige Liquidität',
    description: 'Warnung bei negativem oder sehr niedrigem Saldo',
    check: (state) => {
      const alerts: Alert[] = [];
      const monthlyData = aggregateByMonth(state.transactions);
      const threshold = state.appConfig.liquidityThreshold || 0;

      Object.entries(monthlyData).forEach(([month, data]) => {
        if (data.balance < threshold) {
          const category = state.categories.find((c) => c.name === 'Cashflow');
          
          alerts.push({
            id: `alert-${Date.now()}-${Math.random()}`,
            kind: 'liquidity',
            severity: 'critical',
            title: `Niedrige Liquidität: ${month}`,
            message: `Monatssaldo: ${data.balance.toFixed(2)} (Schwellenwert: ${threshold})`,
            meta: {
              month,
              balance: data.balance,
              income: data.income,
              expense: data.expense,
            },
            createdAt: new Date().toISOString(),
            resolved: false,
          });
        }
      });

      return alerts;
    },
  },

  // Ungewöhnlich große Ausgabe
  {
    id: 'unusual-expense',
    name: 'Ungewöhnlich große Ausgabe',
    description: 'Warnung bei Einzelausgaben deutlich über Durchschnitt',
    check: (state) => {
      const alerts: Alert[] = [];
      const multiplier = state.appConfig.unusualExpenseMultiplier || 3;

      // Calculate average expense over last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const recentExpenses = state.transactions
        .filter((t) => t.type === 'expense' && t.date >= sixMonthsAgo)
        .map((t) => Math.abs(t.amount));

      if (recentExpenses.length === 0) return alerts;
      
      const avgExpense = recentExpenses.reduce((sum, a) => sum + a, 0) / recentExpenses.length;
      const threshold = avgExpense * multiplier;

      // Check for unusual expenses
      state.transactions
        .filter((t) => t.type === 'expense')
        .forEach((tx) => {
          if (Math.abs(tx.amount) > threshold) {
            alerts.push({
              id: `alert-${Date.now()}-${Math.random()}`,
              kind: 'recurring',
              severity: 'info',
              title: `Ungewöhnlich große Ausgabe`,
              message: `${tx.description}: ${Math.abs(tx.amount).toFixed(2)} (Ø: ${avgExpense.toFixed(2)})`,
              meta: {
                transactionId: tx.id,
                amount: tx.amount,
                average: avgExpense,
                threshold,
              },
              createdAt: new Date().toISOString(),
              resolved: false,
            });
          }
        });

      return alerts;
    },
  },

  // Hoher Ausgaben-Anteil
  {
    id: 'high-expense-ratio',
    name: 'Hoher Ausgaben-Anteil',
    description: 'Warnung wenn Ausgaben >80% des Einkommens',
    check: (state) => {
      const alerts: Alert[] = [];
      const monthlyData = aggregateByMonth(state.transactions);

      Object.entries(monthlyData).forEach(([month, data]) => {
        if (data.income > 0) {
          const ratio = data.expense / data.income;
          if (ratio > 0.8) {
            alerts.push({
              id: `alert-${Date.now()}-${Math.random()}`,
              kind: 'recurring',
              severity: 'warning',
              title: `Hoher Ausgaben-Anteil: ${month}`,
              message: `Ausgaben: ${(ratio * 100).toFixed(1)}% des Einkommens`,
              meta: {
                month,
                ratio,
                income: data.income,
                expense: data.expense,
              },
              createdAt: new Date().toISOString(),
              resolved: false,
            });
          }
        }
      });

      return alerts;
    },
  },
];

/**
 * Helper function to aggregate by month
 */
function aggregateByMonth(transactions: Transaction[]): Record<string, { income: number; expense: number; balance: number }> {
  const monthly: Record<string, { income: number; expense: number; balance: number }> = {};

  transactions.forEach((tx) => {
    const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthly[key]) {
      monthly[key] = { income: 0, expense: 0, balance: 0 };
    }

    if (tx.type === 'income') {
      monthly[key].income += tx.amount;
    } else {
      monthly[key].expense += tx.amount;
    }

    monthly[key].balance = monthly[key].income - monthly[key].expense;
  });

  return monthly;
}

function getCategoryName(categoryId: string, categories: Category[]): string {
  return categories.find((c) => c.id === categoryId)?.name || categoryId;
}

/**
 * Evaluate alerts based on current state
 */
export function evaluateAlerts(state: AlertState, rules: AlertRule[] = defaultRules): Alert[] {
  const alerts: Alert[] = [];

  rules.forEach((rule) => {
    try {
      const ruleAlerts = rule.check(state);
      alerts.push(...ruleAlerts);
    } catch (error) {
      console.error(`Error in rule ${rule.id}:`, error);
    }
  });

  return alerts;
}

