import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, 
  CreditCard, 
  Target, 
  PiggyBank,
  Info,
  Settings,
  CheckCircle2
} from 'lucide-react';

export function ModuleManager() {
  const [modules, setModules] = useState([
    {
      id: 'cashflow',
      name: 'Cashflow-Analyse',
      description: 'Visualisierung von Mittelzu- und -abflüssen mit Liquiditätsprognose',
      icon: TrendingUp,
      active: true,
      required: ['Transaktionen', 'Kategorien'],
      color: 'text-chart-1'
    },
    {
      id: 'debt',
      name: 'Schulden-Tracker',
      description: 'Überwachung von Krediten, Darlehen und Zahlungsplänen',
      icon: CreditCard,
      active: false,
      required: ['Kreditoren', 'Zahlungsplan'],
      color: 'text-chart-2'
    },
    {
      id: 'savings',
      name: 'Sparziele',
      description: 'Definieren und verfolgen Sie persönliche Sparziele mit Fortschrittsanzeige',
      icon: Target,
      active: true,
      required: ['Zielbetrag', 'Zeitraum'],
      color: 'text-chart-3'
    },
    {
      id: 'networth',
      name: 'Vermögens-Dashboard',
      description: 'Gesamtübersicht über Vermögenswerte, Schulden und Nettovermögen',
      icon: PiggyBank,
      active: false,
      required: ['Konten', 'Vermögenswerte'],
      color: 'text-chart-4'
    },
  ]);

  const handleToggle = (id: string) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, active: !module.active } : module
    ));
  };

  const activeCount = modules.filter(m => m.active).length;

  return (
    <div className="container mx-auto max-w-[1200px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2">Module verwalten</h2>
        <p className="text-muted-foreground">
          Aktivieren Sie zusätzliche Funktionen für Ihre Budget-Analyse
        </p>
      </div>

      {/* Summary Alert */}
      <Alert className="mb-8 border-primary/50 bg-primary/10">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="body-small">
              <strong>{activeCount} von {modules.length} Modulen</strong> sind aktiv
            </span>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {activeCount} aktiv
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={`border-2 transition-all ${
              module.active 
                ? 'border-primary bg-primary/5' 
                : 'border-border'
            }`}
          >
            <CardHeader className="border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg bg-muted p-3 ${module.active ? 'bg-primary/10' : ''}`}>
                    <module.icon className={`h-6 w-6 ${module.active ? module.color : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h4>{module.name}</h4>
                      {module.active && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
                <Switch
                  checked={module.active}
                  onCheckedChange={() => handleToggle(module.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Required Inputs */}
                <div>
                  <p className="caption mb-2 text-muted-foreground">Benötigte Eingaben:</p>
                  <div className="flex flex-wrap gap-2">
                    {module.required.map((req) => (
                      <Badge key={req} variant="secondary" className="caption">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {module.active ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="mr-2 h-4 w-4" />
                        Konfigurieren
                      </Button>
                      <Button size="sm" className="flex-1">
                        Öffnen
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleToggle(module.id)}
                    >
                      Modul aktivieren
                    </Button>
                  )}
                </div>

                {/* Status Info */}
                {module.active && (
                  <Alert className="border-primary/30 bg-primary/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      <p className="caption">
                        Modul ist aktiv und bereit zur Verwendung
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Preview Cards */}
      <div className="mt-8">
        <h3 className="mb-4">Bald verfügbar</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: 'Steuer-Assistent', description: 'Automatische Kategorisierung für Steuererklärung' },
            { name: 'Rechnungen', description: 'Verwaltung offener und bezahlter Rechnungen' },
            { name: 'Team-Budgets', description: 'Mehrere Benutzer, Rollen & Genehmigungen' },
          ].map((feature, idx) => (
            <Card key={idx} className="border-border opacity-60">
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3 caption">
                  Bald verfügbar
                </Badge>
                <h4 className="mb-2">{feature.name}</h4>
                <p className="caption text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
