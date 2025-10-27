import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, Check, Upload } from 'lucide-react';

interface SetupWizardProps {
  onComplete: (config: any) => void;
  onBack: () => void;
}

export function SetupWizard({ onComplete, onBack }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    country: '',
    currency: '',
    purpose: '',
    primaryColor: '#7F56D9',
    period: 'month',
    fiscalStart: '1',
  });

  const purposes = [
    { 
      id: 'private', 
      label: 'Privat', 
      description: 'Für persönliche Finanzen und Haushalt',
      modules: ['Sparziele', 'Kategorien', 'Trends']
    },
    { 
      id: 'freelancer', 
      label: 'Freelancer', 
      description: 'Für Selbstständige und Freiberufler',
      modules: ['Rechnungen', 'Steuern', 'Cashflow']
    },
    { 
      id: 'kmu', 
      label: 'KMU', 
      description: 'Für kleine und mittlere Unternehmen',
      modules: ['Kostenstellen', 'Projekte', 'Liquidität']
    },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-[800px]">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="caption text-muted-foreground">Schritt {step} von 4</span>
            <span className="caption text-muted-foreground">{Math.round(progress)}% abgeschlossen</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-border">
          <CardHeader className="border-b border-border px-6 py-4">
            <h3>
              {step === 1 && 'Land & Währung'}
              {step === 2 && 'Verwendungszweck'}
              {step === 3 && 'Design anpassen'}
              {step === 4 && 'Zeitraum festlegen'}
            </h3>
            <CardDescription>
              {step === 1 && 'Wählen Sie Ihre Region und bevorzugte Währung'}
              {step === 2 && 'Für welchen Zweck möchten Sie das Budget nutzen?'}
              {step === 3 && 'Personalisieren Sie das Erscheinungsbild'}
              {step === 4 && 'Definieren Sie Ihren Budgetzeitraum'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Country & Currency */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Land</Label>
                    <Select value={config.country} onValueChange={(val) => setConfig({...config, country: val})}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Land auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ch">🇨🇭 Schweiz</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutschland</SelectItem>
                        <SelectItem value="at">🇦🇹 Österreich</SelectItem>
                        <SelectItem value="us">🇺🇸 USA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Währung</Label>
                    <Select value={config.currency} onValueChange={(val) => setConfig({...config, currency: val})}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Währung auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chf">CHF – Schweizer Franken</SelectItem>
                        <SelectItem value="eur">EUR – Euro</SelectItem>
                        <SelectItem value="usd">USD – US-Dollar</SelectItem>
                        <SelectItem value="gbp">GBP – Britisches Pfund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {config.currency && (
                  <div className="rounded-lg border border-border bg-muted p-4">
                    <p className="caption mb-1 text-muted-foreground">Vorschau Format</p>
                    <p className="body-small">
                      Zahl: 1'234.56 {config.currency.toUpperCase()} · 
                      Datum: 27.10.2025
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Purpose */}
            {step === 2 && (
              <RadioGroup value={config.purpose} onValueChange={(val) => setConfig({...config, purpose: val})}>
                <div className="space-y-3">
                  {purposes.map((purpose) => (
                    <Card 
                      key={purpose.id}
                      className={`cursor-pointer border-2 transition-colors ${
                        config.purpose === purpose.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => setConfig({...config, purpose: purpose.id})}
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <RadioGroupItem value={purpose.id} id={purpose.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={purpose.id} className="cursor-pointer">
                            <h4 className="mb-1">{purpose.label}</h4>
                          </Label>
                          <p className="caption mb-3 text-muted-foreground">{purpose.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {purpose.modules.map((module) => (
                              <Badge key={module} variant="secondary" className="caption">
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            )}

            {/* Step 3: Design */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo hochladen (optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Datei auswählen
                    </Button>
                  </div>
                  <p className="caption text-muted-foreground">PNG, JPG oder SVG bis 2MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primärfarbe</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                      className="h-12 w-24 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted p-6">
                  <p className="caption mb-4 text-muted-foreground">Live-Vorschau</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg" 
                        style={{ backgroundColor: config.primaryColor }}
                      />
                      <div>
                        <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          Primärfarbe
                        </p>
                        <p className="caption text-muted-foreground">Buttons, Links, Highlights</p>
                      </div>
                    </div>
                    <Button style={{ backgroundColor: config.primaryColor, color: 'white' }}>
                      Beispiel Button
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Period */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Budgetzeitraum</Label>
                  <RadioGroup value={config.period} onValueChange={(val) => setConfig({...config, period: val})}>
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { value: 'month', label: 'Monatlich' },
                        { value: 'quarter', label: 'Quartalsweise' },
                        { value: 'year', label: 'Jährlich' },
                      ].map((option) => (
                        <Card
                          key={option.value}
                          className={`cursor-pointer border-2 transition-colors ${
                            config.period === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                          onClick={() => setConfig({...config, period: option.value})}
                        >
                          <CardContent className="flex items-center gap-3 p-4">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer flex-1">
                              {option.label}
                            </Label>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalStart">Geschäftsjahr beginnt im Monat</Label>
                  <Select value={config.fiscalStart} onValueChange={(val) => setConfig({...config, fiscalStart: val})}>
                    <SelectTrigger id="fiscalStart">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                      ].map((month, idx) => (
                        <SelectItem key={idx} value={String(idx + 1)}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {step === 1 ? 'Abbrechen' : 'Zurück'}
          </Button>
          <Button onClick={handleNext}>
            {step === 4 ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Fertigstellen
              </>
            ) : (
              <>
                Weiter
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
