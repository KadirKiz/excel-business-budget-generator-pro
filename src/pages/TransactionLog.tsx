import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Search } from 'lucide-react';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { formatCurrency, formatDate } from '../lib/format';

export function TransactionLog() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const transactions = useDataStore((state) => state.transactions);
  const categories = useDataStore((state) => state.categories);
  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    return transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find((c) => c.id === tx.category)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, categories, searchTerm]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transaktionen</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Verwalten Sie Ihre Finanztransaktionen</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Nach Transaktionen suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaktionsliste</CardTitle>
          <CardDescription>Übersicht aller Transaktionen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Datum</TableHead>
                  <TableHead className="min-w-[150px]">Kategorie</TableHead>
                  <TableHead className="min-w-[200px]">Beschreibung</TableHead>
                  <TableHead className="text-right min-w-[120px]">Betrag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Database className="h-16 w-16 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">Keine Transaktionen gefunden</p>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm ? 'Versuchen Sie eine andere Suche' : 'Importieren Sie Daten oder laden Sie die Demo'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((tx) => {
                    const category = categories.find((c) => c.id === tx.category);
                    return (
                      <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">{formatDate(tx.date, locale)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: category?.color || '#999' }} />
                            <span className="text-sm">{category?.name || tx.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[200px] max-w-[400px] truncate">{tx.description}</div>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {tx.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount), currency, locale)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Zeige {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} von {filteredTransactions.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

