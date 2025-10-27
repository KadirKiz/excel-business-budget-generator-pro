import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export function Dashboard() {
  const [period, setPeriod] = useState('month');
  const [category, setCategory] = useState('all');

  const kpis = [
    {
      title: 'Einnahmen',
      value: 'CHF 12\'450',
      change: '+12.5%',
      trend: 'up',
      icon: ArrowUpRight,
      color: 'text-primary'
    },
    {
      title: 'Ausgaben',
      value: 'CHF 8\'320',
      change: '-5.2%',
      trend: 'down',
      icon: ArrowDownRight,
      color: 'text-destructive'
    },
    {
      title: 'Sparquote',
      value: '33.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Warnungen',
      value: '5',
      change: 'Kategorien über Budget',
      trend: 'warning',
      icon: AlertTriangle,
      color: 'text-destructive'
    },
  ];

  const budgetData = [
    { month: 'Apr', soll: 8000, ist: 7800 },
    { month: 'Mai', soll: 8000, ist: 8200 },
    { month: 'Jun', soll: 8000, ist: 7900 },
    { month: 'Jul', soll: 8000, ist: 8500 },
    { month: 'Aug', soll: 8000, ist: 8100 },
    { month: 'Sep', soll: 8000, ist: 8300 },
    { month: 'Oct', soll: 8000, ist: 8320 },
  ];

  const categoryData = [
    { name: 'Wohnen', value: 2400, color: 'hsl(var(--chart-1))' },
    { name: 'Nahrung', value: 1200, color: 'hsl(var(--chart-2))' },
    { name: 'Transport', value: 800, color: 'hsl(var(--chart-3))' },
    { name: 'Unterhaltung', value: 600, color: 'hsl(var(--chart-4))' },
    { name: 'Sonstiges', value: 1320, color: 'hsl(var(--chart-5))' },
  ];

  const trendData = [
    { month: 'Jan', einnahmen: 12000, ausgaben: 8500 },
    { month: 'Feb', einnahmen: 11800, ausgaben: 8200 },
    { month: 'Mär', einnahmen: 12200, ausgaben: 8400 },
    { month: 'Apr', einnahmen: 12100, ausgaben: 7800 },
    { month: 'Mai', einnahmen: 12300, ausgaben: 8200 },
    { month: 'Jun', einnahmen: 12500, ausgaben: 7900 },
    { month: 'Jul', einnahmen: 12400, ausgaben: 8500 },
    { month: 'Aug', einnahmen: 12600, ausgaben: 8100 },
    { month: 'Sep', einnahmen: 12350, ausgaben: 8300 },
    { month: 'Okt', einnahmen: 12450, ausgaben: 8320 },
  ];

  const warnings = [
    { category: 'Unterhaltung', budget: 500, actual: 600, percent: 120 },
    { category: 'Transport', budget: 600, actual: 800, percent: 133 },
    { category: 'Nahrung', budget: 1000, actual: 1200, percent: 120 },
  ];

  return (
    <div className="container mx-auto max-w-[1200px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Überblick über Ihre Finanzen</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Diese Woche</SelectItem>
              <SelectItem value="month">Dieser Monat</SelectItem>
              <SelectItem value="quarter">Dieses Quartal</SelectItem>
              <SelectItem value="year">Dieses Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              <SelectItem value="wohnen">Wohnen</SelectItem>
              <SelectItem value="nahrung">Nahrung</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="caption mb-1 text-muted-foreground">{kpi.title}</p>
                  <h3 className="mb-1">{kpi.value}</h3>
                  <div className="flex items-center gap-1">
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                    <span className={`caption ${kpi.color}`}>{kpi.change}</span>
                  </div>
                </div>
                <div className={`rounded-lg bg-muted p-2`}>
                  {kpi.trend === 'up' && <TrendingUp className={`h-5 w-5 ${kpi.color}`} />}
                  {kpi.trend === 'down' && <TrendingDown className={`h-5 w-5 ${kpi.color}`} />}
                  {kpi.trend === 'warning' && <AlertTriangle className={`h-5 w-5 ${kpi.color}`} />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warning Alert */}
      <Alert className="mb-8 border-destructive/50 bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="body-small">
              <strong>5 Kategorien über Budget</strong> – Prüfen Sie Ihre Ausgaben
            </span>
            <Button variant="outline" size="sm">
              Zur Analyse
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Charts Row 1 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Budget Comparison */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <h4>Budget-Vergleich Soll vs. Ist</h4>
              <Badge variant="secondary">Monatlich</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend />
                <Bar dataKey="soll" fill="hsl(var(--chart-1))" name="Soll" />
                <Bar dataKey="ist" fill="hsl(var(--chart-2))" name="Ist" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <h4>Ausgaben nach Kategorie</h4>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Trend Chart */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <h4>Trend: Einnahmen & Ausgaben (12 Monate)</h4>
              <Badge variant="secondary">CHF</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="einnahmen" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Einnahmen"
                />
                <Line 
                  type="monotone" 
                  dataKey="ausgaben" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Ausgaben"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Warnings Widget */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <h4>Budget-Warnungen</h4>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {warnings.map((warning, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-muted p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {warning.category}
                    </p>
                    <Badge variant="destructive" className="caption">
                      {warning.percent}%
                    </Badge>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <span className="caption text-muted-foreground">Budget:</span>
                    <span className="caption">CHF {warning.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="caption text-muted-foreground">Aktuell:</span>
                    <span className="caption text-destructive">CHF {warning.actual}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                Alle anzeigen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
