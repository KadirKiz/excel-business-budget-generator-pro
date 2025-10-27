import type { Transaction, BudgetPlan, Category } from '../types/finance';
import { toMonthlyKey } from './format';

/**
 * Aggregate transactions by month
 */
export function aggregateByMonth(
  transactions: Transaction[]
): Record<string, { income: number; expense: number; balance: number }> {
  const monthly: Record<string, { income: number; expense: number; balance: number }> = {};

  transactions.forEach((tx) => {
    const key = toMonthlyKey(tx.date);
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

/**
 * Calculate variance between planned and actual
 */
export function variance(
  plans: BudgetPlan[],
  actuals: Transaction[]
): Array<{
  categoryId: string;
  month: string;
  plan: number;
  actual: number;
  diff: number;
  diffPct: number;
}> {
  const result: Array<{
    categoryId: string;
    month: string;
    plan: number;
    actual: number;
    diff: number;
    diffPct: number;
  }> = [];

  // Group actuals by category and month
  const actualByCatMonth: Record<string, Record<string, number>> = {};
  actuals.forEach((tx) => {
    const key = toMonthlyKey(tx.date);
    if (!actualByCatMonth[tx.category]) {
      actualByCatMonth[tx.category] = {};
    }
    if (!actualByCatMonth[tx.category][key]) {
      actualByCatMonth[tx.category][key] = 0;
    }
    actualByCatMonth[tx.category][key] += Math.abs(tx.amount);
  });

  // Process plans
  plans.forEach((plan) => {
    plan.categories.forEach((catBudget) => {
      const monthKeys = Object.keys(actualByCatMonth[catBudget.categoryId] || {});
      monthKeys.forEach((month) => {
        const actual = actualByCatMonth[catBudget.categoryId]?.[month] || 0;
        const planAmount = catBudget.budgeted;
        const diff = planAmount - actual;
        const diffPct = planAmount > 0 ? (diff / planAmount) * 100 : 0;

        result.push({
          categoryId: catBudget.categoryId,
          month,
          plan: planAmount,
          actual,
          diff,
          diffPct,
        });
      });
    });
  });

  return result;
}

/**
 * Calculate totals by category
 */
export function categoryTotals(transactions: Transaction[]): Array<{
  categoryId: string;
  total: number;
}> {
  const totals: Record<string, number> = {};

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      if (!totals[tx.category]) {
        totals[tx.category] = 0;
      }
      totals[tx.category] += Math.abs(tx.amount);
    }
  });

  return Object.entries(totals)
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
}

