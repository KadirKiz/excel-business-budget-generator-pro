import type { CurrencyCode, LocaleCode } from '../types/finance';
import { format as dateFnsFormat, parseISO } from 'date-fns';

/**
 * Format currency amount with locale and currency code
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: LocaleCode
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date with locale
 */
export function formatDate(date: Date | string, locale: LocaleCode): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeMap: Record<LocaleCode, string> = {
    'de-CH': 'dd.MM.yyyy',
    'en-US': 'MM/dd/yyyy',
  };
  return dateFnsFormat(dateObj, localeMap[locale] || 'dd.MM.yyyy');
}

/**
 * Convert date to YYYY-MM key for monthly aggregation
 */
export function toMonthlyKey(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsFormat(dateObj, 'yyyy-MM');
}

