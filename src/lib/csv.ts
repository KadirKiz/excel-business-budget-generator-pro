import Papa from 'papaparse';
import type { CsvRawRow, ImportMapping, ImportResult } from '../types/import';
import type { Transaction, LocaleCode, CurrencyCode } from '../types/finance';
import { parse, isValid } from 'date-fns';

/**
 * Detect CSV delimiter from sample string
 */
export function detectDelimiter(sample: string): ',' | ';' | '\t' {
  const delimiters = [',', ';', '\t'] as const;
  const counts = delimiters.map((delim) => (sample.match(new RegExp(delim, 'g')) || []).length);
  const maxIndex = counts.indexOf(Math.max(...counts));
  return delimiters[maxIndex];
}

/**
 * Parse CSV file and return headers + rows
 */
export async function parseCsv(file: File): Promise<{ headers: string[]; rows: CsvRawRow[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as CsvRawRow[];
        const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
        resolve({ headers, rows });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Map CSV rows to Transaction objects with validation
 */
export function mapCsvRows(
  rows: CsvRawRow[],
  mapping: ImportMapping,
  locale: LocaleCode,
  currency: CurrencyCode,
  categoryIndex: Record<string, string>
): { valid: Transaction[]; errors: ImportResult['errors'] } {
  const valid: Transaction[] = [];
  const errors: ImportResult['errors'] = [];

  const dateFormat = locale === 'de-CH' ? 'dd.MM.yyyy' : 'MM/dd/yyyy';

  rows.forEach((row, index) => {
    try {
      // Extract values from mapping
      const dateStr = row[mapping.date];
      const description = row[mapping.description];
      const amountStr = row[mapping.amount];
      const categoryStr = mapping.category ? row[mapping.category] : undefined;
      const typeStr = mapping.type ? row[mapping.type] : undefined;

      // Validate date
      let date: Date;
      if (dateStr) {
        const parsed = parse(dateStr, dateFormat, new Date());
        if (!isValid(parsed)) {
          // Try ISO format
          const isoDate = new Date(dateStr);
          if (!isValid(isoDate)) {
            throw new Error(`Ungültiges Datum: ${dateStr}`);
          }
          date = isoDate;
        } else {
          date = parsed;
        }
      } else {
        throw new Error('Datum fehlt');
      }

      // Validate amount
      if (!amountStr) {
        throw new Error('Betrag fehlt');
      }

      // Parse amount (handle comma/dot as decimal separator)
      let amount = parseFloat(amountStr.replace(',', '.'));
      if (isNaN(amount)) {
        throw new Error(`Ungültiger Betrag: ${amountStr}`);
      }

      // Determine transaction type
      let type: 'income' | 'expense';
      if (typeStr) {
        type = typeStr.toLowerCase().includes('income') || typeStr.toLowerCase().includes('einnahme') ? 'income' : 'expense';
      } else {
        // Heuristic: positive = income, negative = expense
        type = amount >= 0 ? 'income' : 'expense';
      }

      // Make amount positive
      amount = Math.abs(amount);

      // Find category
      let categoryId = 'expense-other'; // default
      if (categoryStr) {
        const lowerName = categoryStr.toLowerCase().trim();
        categoryId = categoryIndex[lowerName] || categoryId;
      }

      // Create transaction
      const transaction: Transaction = {
        id: `imported-${Date.now()}-${index}`,
        date,
        amount,
        currency,
        category: categoryId,
        description: description || 'Import',
        type,
      };

      valid.push(transaction);
    } catch (error) {
      errors.push({
        row: index + 2, // +2 because of header + 1-based
        reason: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  });

  return { valid, errors };
}

