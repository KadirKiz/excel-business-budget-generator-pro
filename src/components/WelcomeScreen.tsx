import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { TrendingUp, Shield, Zap, Globe } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const features = [
    {
      icon: TrendingUp,
      title: 'Intelligente Analysen',
      description: 'Automatische Budgetanalysen mit Soll-Ist-Vergleich und Abweichungsdarstellung'
    },
    {
      icon: Zap,
      title: 'Schnelle Einrichtung',
      description: 'In wenigen Schritten zu Ihrem personalisierten Budget-Dashboard'
    },
    {
      icon: Globe,
      title: 'Mehrere Währungen',
      description: 'Unterstützung für internationale Formate und Währungen'
    },
    {
      icon: Shield,
      title: 'Ihre Daten bleiben lokal',
      description: 'Alle Berechnungen erfolgen in Ihrem Browser – maximale Datensicherheit'
    }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-[1200px]">
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-4">Excel Business Budget Generator Pro</h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground">
            Erstellen Sie professionelle Budget-Analysen mit automatischer Kategorisierung, 
            Soll-Ist-Vergleich und Export in Excel, PDF oder CSV.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2">{feature.title}</h4>
                <p className="caption text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button 
            size="lg" 
            onClick={onStart}
            className="px-8"
          >
            Jetzt starten
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Mehr erfahren
            </Button>
            <span className="text-muted-foreground">·</span>
            <Button variant="ghost" size="sm">
              Datenschutz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
