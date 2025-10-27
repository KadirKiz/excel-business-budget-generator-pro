import { useTranslation } from 'react-i18next';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { formatCurrency } from '../lib/format';

export function Analysis() {
  const { t } = useTranslation();
  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();
  const selectVariance = useDataStore((state) => state.selectVariance);
  const categories = useDataStore((state) => state.categories);
  
  const varianceData = selectVariance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analyse</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Budgetabweichungen und Trends</p>
      </div>

      {/* Variance Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Abweichungs-Matrix</CardTitle>
          <CardDescription>Plan vs. Ist-Vergleich</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Kategorie</TableHead>
                  <TableHead className="text-right min-w-[100px]">Plan</TableHead>
                  <TableHead className="text-right min-w-[100px]">Ist</TableHead>
                  <TableHead className="text-right min-w-[120px]">Abweichung</TableHead>
                  <TableHead className="text-right min-w-[80px]">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {varianceData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      Keine Daten verfügbar
                    </TableCell>
                  </TableRow>
                ) : (
                  varianceData.map((v, idx) => {
                    const category = categories.find((c) => c.id === v.categoryId);
                    const diffClass = v.diff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
                    return (
                      <TableRow key={`${v.categoryId}-${v.month}-${idx}`}>
                        <TableCell className="font-medium">{category?.name || v.categoryId}</TableCell>
                        <TableCell className="text-right">{formatCurrency(v.plan, currency, locale)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(v.actual, currency, locale)}</TableCell>
                        <TableCell className={`text-right font-semibold ${diffClass}`}>
                          {v.diff > 0 ? '+' : ''}{formatCurrency(v.diff, currency, locale)}
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${diffClass}`}>
                          {v.diffPct > 0 ? '+' : ''}{v.diffPct.toFixed(1)}%
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
    </div>
  );
}

