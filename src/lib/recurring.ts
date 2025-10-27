import type { Transaction } from '../types/finance';
import type { RecurringTransaction } from '../store/slices/recurringSlice';

/**
 * Generate transactions from recurring patterns
 */
export function generateTransactionsFromRecurring(
  recurrings: RecurringTransaction[],
  currentDate: Date = new Date()
): Transaction[] {
  const transactions: Transaction[] = [];

  for (const recurring of recurrings) {
    if (!recurring.isActive) continue;
    if (recurring.endDate && new Date(recurring.endDate) < currentDate) continue;
    if (new Date(recurring.nextOccurrence) > currentDate) continue;

    // Generate transaction
    const transaction: Transaction = {
      id: `recurring-${recurring.id}-${crypto.randomUUID()}`,
      date: new Date(recurring.nextOccurrence),
      amount: recurring.type === 'income' ? recurring.amount : -recurring.amount,
      currency: recurring.currency,
      category: recurring.category,
      description: recurring.description,
      type: recurring.type,
    };

    transactions.push(transaction);
  }

  return transactions;
}

/**
 * Calculate next occurrence date based on frequency
 */
export function calculateNextOccurrence(
  lastDate: Date,
  frequency: RecurringTransaction['frequency']
): Date {
  const nextDate = new Date(lastDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}

/**
 * Get frequency label
 */
export function getFrequencyLabel(frequency: RecurringTransaction['frequency']): string {
  const labels = {
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    monthly: 'Monatlich',
    quarterly: 'Quartalsweise',
    yearly: 'Jährlich',
  };
  return labels[frequency];
}

