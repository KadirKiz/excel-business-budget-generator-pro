import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TrendingUp, TrendingDown, AlertCircle, ChevronRight, Calendar } from 'lucide-react';

export function Analysis() {
  const [period, setPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const analysisData = [
    { 
      category: 'Wohnen', 
      jan: { plan: 1200, actual: 1200, variance: 0 },
      feb: { plan: 1200, actual: 1200, variance: 0 },
      mar: { plan: 1200, actual: 1250, variance: 50 },
      apr: { plan: 1200, actual: 1200, variance: 0 },
      total: { plan: 4800, actual: 4850, variance: 50 }
    },
    { 
      category: 'Nahrung', 
      jan: { plan: 800, actual: 850, variance: 50 },
      feb: { plan: 800, actual: 780, variance: -20 },
      mar: { plan: 800, actual: 920, variance: 120 },
      apr: { plan: 800, actual: 860, variance: 60 },
      total: { plan: 3200, actual: 3410, variance: 210 }
    },
    { 
      category: 'Transport', 
      jan: { plan: 400, actual: 350, variance: -50 },
      feb: { plan: 400, actual: 420, variance: 20 },
      mar: { plan: 400, actual: 480, variance: 80 },
      apr: { plan: 400, actual: 450, variance: 50 },
      total: { plan: 1600, actual: 1700, variance: 100 }
    },
    { 
      category: 'Unterhaltung', 
      jan: { plan: 300, actual: 350, variance: 50 },
      feb: { plan: 300, actual: 280, variance: -20 },
      mar: { plan: 300, actual: 380, variance: 80 },
      apr: { plan: 300, actual: 320, variance: 20 },
      total: { plan: 1200, actual: 1330, variance: 130 }
    },
    { 
      category: 'Gesundheit', 
      jan: { plan: 200, actual: 180, variance: -20 },
      feb: { plan: 200, actual: 210, variance: 10 },
      mar: { plan: 200, actual: 195, variance: -5 },
      apr: { plan: 200, actual: 220, variance: 20 },
      total: { plan: 800, actual: 805, variance: 5 }
    },
  ];

  const getVarianceColor = (variance: number) => {
    if (variance > 50) return 'bg-destructive/20 text-destructive';
    if (variance > 0) return 'bg-destructive/10 text-destructive';
    if (variance < -50) return 'bg-primary/20 text-primary';
    if (variance < 0) return 'bg-primary/10 text-primary';
    return 'bg-muted text-muted-foreground';
  };

  const getVarianceIntensity = (variance: number, plan: number) => {
    const percent = Math.abs((variance / plan) * 100);
    if (percent > 20) return 'border-2 border-destructive';
    if (percent > 10) return 'border border-destructive';
    return '';
  };

  const formatCurrency = (value: number) => {
    return `${value.toFixed(0)} CHF`;
  };

  const formatVariance = (variance: number) => {
    return variance > 0 ? `+${variance}` : `${variance}`;
  };

  return (
    <div className="container mx-auto max-w-[1200px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2">Analyse & Abweichungen</h2>
          <p className="text-muted-foreground">Detaillierter Soll-Ist-Vergleich nach Kategorie</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monatlich</SelectItem>
            <SelectItem value="quarter">Quartalsweise</SelectItem>
            <SelectItem value="year">Jährlich</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="caption mb-1 text-muted-foreground">Gesamtbudget</p>
            <h3 className="mb-1">CHF 11'600</h3>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="caption text-muted-foreground">4 Monate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="caption mb-1 text-muted-foreground">Tatsächliche Ausgaben</p>
            <h3 className="mb-1">CHF 12'095</h3>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-destructive" />
              <span className="caption text-destructive">+4.3% über Budget</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="caption mb-1 text-muted-foreground">Gesamtabweichung</p>
            <h3 className="mb-1 text-destructive">+CHF 495</h3>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="caption text-destructive">Optimierung nötig</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variance Matrix */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <h3>Abweichungsmatrix</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary/20"></div>
                <span className="caption text-muted-foreground">Unter Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-destructive/20"></div>
                <span className="caption text-muted-foreground">Über Budget</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="sticky left-0 bg-card">Kategorie</TableHead>
                <TableHead className="text-center">Januar</TableHead>
                <TableHead className="text-center">Februar</TableHead>
                <TableHead className="text-center">März</TableHead>
                <TableHead className="text-center">April</TableHead>
                <TableHead className="text-center bg-muted">Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisData.map((row, idx) => (
                <TableRow key={idx} className="border-b border-border">
                  <TableCell className="sticky left-0 bg-card">
                    <span className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {row.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={`rounded-md p-2 text-center ${getVarianceColor(row.jan.variance)} ${getVarianceIntensity(row.jan.variance, row.jan.plan)}`}>
                      <div className="caption" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {formatCurrency(row.jan.actual)}
                      </div>
                      <div className="caption">
                        {formatVariance(row.jan.variance)}
                      </div>
                      <div className="caption opacity-70">
                        {((row.jan.variance / row.jan.plan) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`rounded-md p-2 text-center ${getVarianceColor(row.feb.variance)} ${getVarianceIntensity(row.feb.variance, row.feb.plan)}`}>
                      <div className="caption" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {formatCurrency(row.feb.actual)}
                      </div>
                      <div className="caption">
                        {formatVariance(row.feb.variance)}
                      </div>
                      <div className="caption opacity-70">
                        {((row.feb.variance / row.feb.plan) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`rounded-md p-2 text-center ${getVarianceColor(row.mar.variance)} ${getVarianceIntensity(row.mar.variance, row.mar.plan)}`}>
                      <div className="caption" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {formatCurrency(row.mar.actual)}
                      </div>
                      <div className="caption">
                        {formatVariance(row.mar.variance)}
                      </div>
                      <div className="caption opacity-70">
                        {((row.mar.variance / row.mar.plan) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`rounded-md p-2 text-center ${getVarianceColor(row.apr.variance)} ${getVarianceIntensity(row.apr.variance, row.apr.plan)}`}>
                      <div className="caption" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {formatCurrency(row.apr.actual)}
                      </div>
                      <div className="caption">
                        {formatVariance(row.apr.variance)}
                      </div>
                      <div className="caption opacity-70">
                        {((row.apr.variance / row.apr.plan) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="bg-muted">
                    <div className={`rounded-md p-2 text-center ${getVarianceColor(row.total.variance)}`}>
                      <div className="caption" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        {formatCurrency(row.total.actual)}
                      </div>
                      <div className="caption" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        {formatVariance(row.total.variance)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedCategory(row)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Drawer */}
      <Sheet open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <SheetContent className="w-full sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedCategory?.category} – Details</SheetTitle>
            <SheetDescription>
              Detaillierte Aufschlüsselung der Abweichungen
            </SheetDescription>
          </SheetHeader>
          
          {selectedCategory && (
            <div className="mt-6 space-y-6">
              {/* Monthly Breakdown */}
              <div>
                <h4 className="mb-4">Monatliche Übersicht</h4>
                <div className="space-y-3">
                  {['jan', 'feb', 'mar', 'apr'].map((month, idx) => {
                    const monthData = selectedCategory[month as keyof typeof selectedCategory] as any;
                    const monthNames = ['Januar', 'Februar', 'März', 'April'];
                    return (
                      <Card key={month} className="border-border">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                              {monthNames[idx]}
                            </span>
                            <Badge variant={monthData.variance > 0 ? 'destructive' : 'default'}>
                              {formatVariance(monthData.variance)} CHF
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="caption mb-1 text-muted-foreground">Geplant</p>
                              <p className="body-small">{formatCurrency(monthData.plan)}</p>
                            </div>
                            <div>
                              <p className="caption mb-1 text-muted-foreground">Tatsächlich</p>
                              <p className="body-small">{formatCurrency(monthData.actual)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="mb-4">Empfehlungen</h4>
                <div className="space-y-3">
                  <Card className="border-border bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <TrendingDown className="h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="body-small mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            Budget anpassen
                          </p>
                          <p className="caption text-muted-foreground">
                            Erhöhen Sie das Budget für diese Kategorie um 10-15% basierend auf dem Trend.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="body-small mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            Ausgaben überwachen
                          </p>
                          <p className="caption text-muted-foreground">
                            Setzen Sie Benachrichtigungen bei 80% Budgetauslastung.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
