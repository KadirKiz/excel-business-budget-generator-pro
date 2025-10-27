/**
 * Calculate trends comparing current period vs previous period
 */

import type { Transaction } from '../types/finance';

interface MonthlyData {
  income: number;
  expense: number;
  balance: number;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Calculate percentage change (standalone)
 */
export function calculateTrendValue(current: number, previous: number): number {
  return calculatePercentChange(current, previous);
}

/**
 * Calculate trends for income, expense, and balance
 */
export function calculateTrends(
  currentData: MonthlyData,
  previousData: MonthlyData
): {
  incomeTrend: number;
  expenseTrend: number;
  balanceTrend: number;
} {
  return {
    incomeTrend: calculatePercentChange(currentData.income, previousData.income),
    expenseTrend: calculatePercentChange(currentData.expense, previousData.expense),
    balanceTrend: calculatePercentChange(currentData.balance, previousData.balance),
  };
}

/**
 * Format trend as string with sign
 */
export function formatTrend(trend: number): string {
  const sign = trend > 0 ? '+' : '';
  return `${sign}${trend.toFixed(1)}%`;
}

/**
 * Get trend label (color class)
 */
export function getTrendLabel(trend: number, isPositive: boolean = true): 'positive' | 'negative' | 'neutral' {
  if (Math.abs(trend) < 1) return 'neutral';
  return isPositive ? (trend > 0 ? 'positive' : 'negative') : (trend < 0 ? 'positive' : 'negative');
}

