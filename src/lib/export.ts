import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Transaction, Category, BudgetPlan, LocaleCode, CurrencyCode } from '../types/finance';
import { formatCurrency, formatDate } from './format';
import { aggregateByMonth } from './compute';
import { toMonthlyKey } from './format';

export type ExportBranding = {
  brandName?: string;
  primaryColorHex?: string;
  logoDataUrl?: string;
};

export type ExportOptions = {
  type: 'xlsx' | 'csv';
  sheets?: ('transactions' | 'categories' | 'budgets' | 'summary')[];
  branding?: ExportBranding;
};

export type ExportState = {
  transactions: Transaction[];
  categories: Category[];
  budgets: BudgetPlan[];
  locale: LocaleCode;
  currency: CurrencyCode;
};

/**
 * CSV Serialization
 */
export function serializeCsv<T extends Record<string, any>>(rows: T[], delimiter = ';'): string {
  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const csvRows = rows.map((row) =>
    headers
      .map((key) => {
        const value = row[key];
        // Escape quotes and wrap in quotes if contains delimiter or newline
        if (typeof value === 'string' && (value.includes(delimiter) || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(delimiter)
  );

  return [headers.join(delimiter), ...csvRows].join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

/**
 * Build Excel Workbook
 */
export async function buildWorkbook(opts: ExportOptions, state: ExportState): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Excel Business Budget Generator Pro';
  wb.created = new Date();

  const sheets = opts.sheets || ['transactions', 'categories', 'budgets', 'summary'];
  const branding = opts.branding || {};

  // Transactions Sheet
  if (sheets.includes('transactions')) {
    const ws = wb.addWorksheet('Transactions');
    ws.columns = [
      { header: 'Datum', key: 'date', width: 12 },
      { header: 'Beschreibung', key: 'description', width: 30 },
      { header: 'Kategorie', key: 'category', width: 20 },
      { header: 'Typ', key: 'type', width: 10 },
      { header: 'Betrag', key: 'amount', width: 15 },
    ];

    state.transactions.forEach((tx) => {
      const category = state.categories.find((c) => c.id === tx.category);
      ws.addRow({
        date: formatDate(tx.date, state.locale),
        description: tx.description,
        category: category?.name || tx.category,
        type: tx.type === 'income' ? 'Einnahme' : 'Ausgabe',
        amount: formatCurrency(tx.amount, state.currency, state.locale),
      });
    });

    // Style header
    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + (branding.primaryColorHex?.replace('#', '') || '1890FF') },
    };
    ws.getRow(1).font = { ...ws.getRow(1).font, color: { argb: 'FFFFFFFF' } };
  }

  // Categories Sheet
  if (sheets.includes('categories')) {
    const ws = wb.addWorksheet('Categories');
    ws.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Typ', key: 'type', width: 12 },
    ];

    state.categories.forEach((cat) => {
      ws.addRow({
        id: cat.id,
        name: cat.name,
        type: cat.type === 'income' ? 'Einnahme' : cat.type === 'expense' ? 'Ausgabe' : 'Beide',
      });
    });

    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + (branding.primaryColorHex?.replace('#', '') || '1890FF') },
    };
    ws.getRow(1).font = { ...ws.getRow(1).font, color: { argb: 'FFFFFFFF' } };
  }

  // Budgets Sheet
  if (sheets.includes('budgets')) {
    const ws = wb.addWorksheet('Budgets');
    ws.columns = [
      { header: 'Kategorie-ID', key: 'categoryId', width: 30 },
      { header: 'Monat', key: 'month', width: 12 },
      { header: 'Budget', key: 'budgeted', width: 15 },
    ];

    state.budgets.forEach((budget) => {
      budget.categories.forEach((cat) => {
        ws.addRow({
          categoryId: cat.categoryId,
          month: toMonthlyKey(budget.startDate),
          budgeted: formatCurrency(cat.budgeted, state.currency, state.locale),
        });
      });
    });

    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + (branding.primaryColorHex?.replace('#', '') || '1890FF') },
    };
    ws.getRow(1).font = { ...ws.getRow(1).font, color: { argb: 'FFFFFFFF' } };
  }

  // Summary Sheet
  if (sheets.includes('summary')) {
    const ws = wb.addWorksheet('Summary');

    // Add logo if provided
    if (branding.logoDataUrl) {
      const logoMatch = branding.logoDataUrl.match(/data:image\/(.+);base64,(.+)/);
      if (logoMatch) {
        const imageId = wb.addImage({
          base64: logoMatch[2],
          extension: logoMatch[1] as 'png' | 'jpeg',
        });

        ws.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 100, height: 50 },
        });
      }
    }

    // Branding info
    let startRow = 10;
    ws.getCell('A1').value = branding.brandName || 'Excel Business Budget Generator Pro';
    ws.getCell('A1').font = { bold: true, size: 14 };
    ws.mergeCells('A1:B1');

    ws.getRow(startRow).values = ['Export-Datum:', new Date().toLocaleDateString(state.locale)];
    ws.getRow(startRow + 1).values = ['Währung:', state.currency];
    ws.getRow(startRow + 2).values = ['Locale:', state.locale];

    // KPIs
    const monthlyData = aggregateByMonth(state.transactions);
    const totalIncome = Object.values(monthlyData).reduce((sum, m) => sum + m.income, 0);
    const totalExpense = Object.values(monthlyData).reduce((sum, m) => sum + m.expense, 0);
    const balance = totalIncome - totalExpense;

    ws.getRow(startRow + 4).values = ['KPIs:', ''];
    ws.getRow(startRow + 4).font = { bold: true };
    ws.getRow(startRow + 5).values = ['Gesamteinnahmen:', formatCurrency(totalIncome, state.currency, state.locale)];
    ws.getRow(startRow + 6).values = ['Gesamtausgaben:', formatCurrency(totalExpense, state.currency, state.locale)];
    ws.getRow(startRow + 7).values = ['Saldo:', formatCurrency(balance, state.currency, state.locale)];

    // README
    const readmeRow = startRow + 9;
    ws.getCell(`A${readmeRow}`).value = 'README:';
    ws.getCell(`A${readmeRow}`).font = { bold: true };
    ws.getCell(`A${readmeRow + 1}`).value = 'Dieses Dokument wurde automatisch generiert.';
    ws.getCell(`A${readmeRow + 2}`).value = 'Enthalten: Transaktionen, Kategorien, Budgets, Summary mit KPIs.';
    ws.mergeCells(`A${readmeRow + 1}:C${readmeRow + 1}`);
    ws.mergeCells(`A${readmeRow + 2}:C${readmeRow + 2}`);

    ws.getColumn(1).width = 25;
    ws.getColumn(2).width = 25;
  }

  return wb;
}

/**
 * Download XLSX
 */
export async function downloadXlsx(filename: string, wb: ExcelJS.Workbook): Promise<void> {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, filename);
}

