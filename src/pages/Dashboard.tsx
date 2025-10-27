import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { useAlertsStore } from '../store/slices/alertsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import { Area, AreaChart, Bar, BarChart, Cell, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();
  
  const selectMonthlyAgg = useDataStore((state) => state.selectMonthlyAgg);
  const selectCategoryTotals = useDataStore((state) => state.selectCategoryTotals);
  const alerts = useAlertsStore((state) => state.alerts);
  
  const monthlyData = selectMonthlyAgg();
  const categoryData = selectCategoryTotals();

  // Calculate totals
  const totalIncome = Object.values(monthlyData).reduce((sum, m) => sum + m.income, 0);
  const totalExpense = Object.values(monthlyData).reduce((sum, m) => sum + m.expense, 0);
  const balance = totalIncome - totalExpense;
  
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0';

  const kpiData = [
    { title: 'Gesamteinnahmen', value: totalIncome, trend: '+5.2%' },
    { title: 'Gesamtausgaben', value: totalExpense, trend: '-2.1%' },
    { title: 'Saldo', value: balance, trend: `Sparquote: ${savingsRate}%` },
  ];

  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('dashboard.title', 'Dashboard')}</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Übersicht über Ihre Finanzen
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(kpi.value, currency, locale)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Widget */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Wichtige Alerts</CardTitle>
            <CardDescription>Aktive Warnungen und Hinweise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
                {activeAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                {alert.severity === 'critical' ? (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                </div>
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
            {alerts.filter((a) => !a.resolved).length > 3 && (
              <Button variant="outline" className="w-full" onClick={() => navigate('/analysis')}>
                Alle Alerts anzeigen
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cashflow</CardTitle>
            <CardDescription>Einnahmen vs. Ausgaben (Letzte 12 Monate)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              income: { label: 'Einnahmen', color: '#22c55e' },
              expense: { label: 'Ausgaben', color: '#ef4444' }
            }}>
              <ResponsiveContainer width="100%" height="min(400px, 50vh)">
                <LineChart data={Object.entries(monthlyData).slice(0, 12).map(([month, data]) => ({
                  month,
                  income: data.income,
                  expense: data.expense
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ausgaben nach Kategorie</CardTitle>
            <CardDescription>Top 5 Kategorien</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              category: { label: 'Kategorie', color: 'hsl(var(--chart-1))' }
            }}>
              <ResponsiveContainer width="100%" height="min(400px, 50vh)">
                <PieChart>
                  <Pie
                    data={categoryData.slice(0, 5).map(cat => ({
                      name: cat.categoryId,
                      value: Math.abs(cat.total)
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 70}, 75%, 55%)`} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

