import { useTranslation } from 'react-i18next';
import { useModulesStore } from '../store/slices/modulesSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export function ModuleManager() {
  const { t } = useTranslation();
  const cashflow = useModulesStore((state) => state.cashflow);
  const debts = useModulesStore((state) => state.debts);
  const savings = useModulesStore((state) => state.savings);
  const netWorth = useModulesStore((state) => state.netWorth);
  const toggleModule = useModulesStore((state) => state.toggleModule);

  const modules = { cashflow, debts, savings, netWorth };

  const moduleList = [
    { key: 'cashflow' as const, label: 'Cashflow', description: 'Einnahmen und Ausgaben' },
    { key: 'debts' as const, label: 'Schulden', description: 'Kreditverwaltung' },
    { key: 'savings' as const, label: 'Sparziele', description: 'Sparen und Investitionen' },
    { key: 'netWorth' as const, label: 'Net Worth', description: 'Vermögensstatus' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Module</h1>
        <p className="text-muted-foreground">Aktivieren Sie die gewünschten Funktionen</p>
      </div>

      <div className="grid gap-4">
        {moduleList.map((module) => (
          <Card key={module.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{module.label}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={modules[module.key].enabled}
                    onCheckedChange={() => toggleModule(module.key)}
                  />
                  <Label className="sr-only">Toggle {module.label}</Label>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

