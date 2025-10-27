import type { Category, BudgetPlan, Transaction } from '../types/finance';
import { subMonths, addDays } from 'date-fns';

// Helper function for random integers
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const demoCategories: Category[] = [
  { id: 'income-salary', name: 'Gehalt', type: 'income', color: '#52c41a' },
  { id: 'income-freelance', name: 'Freelance', type: 'income', color: '#52c41a' },
  { id: 'income-investments', name: 'Investitionen', type: 'income', color: '#52c41a' },
  { id: 'expense-housing', name: 'Wohnung', type: 'expense', color: '#ff4d4f' },
  { id: 'expense-food', name: 'Lebensmittel', type: 'expense', color: '#fa8c16' },
  { id: 'expense-transport', name: 'Transport', type: 'expense', color: '#1890ff' },
  { id: 'expense-entertainment', name: 'Unterhaltung', type: 'expense', color: '#722ed1' },
  { id: 'expense-health', name: 'Gesundheit', type: 'expense', color: '#eb2f96' },
  { id: 'expense-utilities', name: 'Nebenkosten', type: 'expense', color: '#13c2c2' },
  { id: 'expense-insurance', name: 'Versicherung', type: 'expense', color: '#faad14' },
  { id: 'expense-education', name: 'Bildung', type: 'expense', color: '#2f54eb' },
  { id: 'expense-other', name: 'Sonstiges', type: 'expense', color: '#8c8c8c' },
];

export function generateDemoTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  const categories = demoCategories;
  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  // Generate transactions for last 12 months
  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const monthDate = subMonths(now, monthOffset);
    const daysInMonth = 30;

    // Income transactions (2-4 per month)
    for (let i = 0; i < randomInt(2, 4); i++) {
      const category = incomeCategories[randomInt(0, incomeCategories.length)];
      const amount = category.id === 'income-salary' ? 6500 : randomInt(500, 3000);
      transactions.push({
        id: `tx-${monthOffset}-income-${i}`,
        date: addDays(monthDate, randomInt(1, daysInMonth)),
        amount,
        currency: 'CHF',
        category: category.id,
        description: `${category.name} - Monat ${monthOffset + 1}`,
        type: 'income',
      });
    }

    // Expense transactions (15-25 per month)
    for (let i = 0; i < randomInt(15, 25); i++) {
      const category = expenseCategories[randomInt(0, expenseCategories.length)];
      let amount: number;

      switch (category.id) {
        case 'expense-housing':
          amount = randomInt(1200, 1800);
          break;
        case 'expense-food':
          amount = randomInt(300, 700);
          break;
        case 'expense-transport':
          amount = randomInt(50, 300);
          break;
        case 'expense-utilities':
          amount = randomInt(100, 250);
          break;
        case 'expense-insurance':
          amount = randomInt(200, 500);
          break;
        default:
          amount = randomInt(20, 200);
      }

      transactions.push({
        id: `tx-${monthOffset}-expense-${i}`,
        date: addDays(monthDate, randomInt(1, daysInMonth)),
        amount,
        currency: 'CHF',
        category: category.id,
        description: `${category.name} - ${new Date().toLocaleDateString()}`,
        type: 'expense',
      });
    }
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generateDemoBudgets(categories: Category[]): BudgetPlan[] {
  const plans: BudgetPlan[] = [];
  const now = new Date();

  // Create monthly budgets for last 12 months
  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const monthDate = subMonths(now, monthOffset);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;

    const expenseCats = categories.filter((c) => c.type === 'expense').slice(0, 8);

    plans.push({
      id: `budget-${monthKey}`,
      name: `Budget ${monthKey}`,
      period: 'monthly',
      startDate: monthDate,
      endDate: monthDate,
      categories: expenseCats.map((cat) => ({
        categoryId: cat.id,
        budgeted: getBudgetAmount(cat.id),
      })),
    });
  }

  return plans;
}

function getBudgetAmount(categoryId: string): number {
  const budgets: Record<string, number> = {
    'expense-housing': 1500,
    'expense-food': 600,
    'expense-transport': 200,
    'expense-utilities': 180,
    'expense-insurance': 400,
    'expense-entertainment': 300,
    'expense-health': 150,
    'expense-education': 500,
    'expense-other': 100,
  };

  return budgets[categoryId] || 100;
}

