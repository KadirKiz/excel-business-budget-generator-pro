import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileSpreadsheet, 
  FileText, 
  File,
  Upload,
  CheckCircle2,
  Download,
  Settings,
  Eye
} from 'lucide-react';

export function ExportGenerator() {
  const [format, setFormat] = useState('excel');
  const [status, setStatus] = useState<'config' | 'generating' | 'complete'>('config');
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState({
    includeLogo: true,
    includeCharts: true,
    includeFooter: true,
    period: 'current',
  });

  const formats = [
    {
      id: 'excel',
      name: 'Excel (.xlsx)',
      description: 'Vollständige Daten mit Formeln und Formatierung',
      icon: FileSpreadsheet,
      features: ['Formeln', 'Charts', 'Mehrere Sheets']
    },
    {
      id: 'pdf',
      name: 'PDF Dashboard',
      description: 'Druckfertige Übersicht mit Charts und Zusammenfassung',
      icon: FileText,
      features: ['Druckoptimiert', 'Grafiken', 'Branding']
    },
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Rohdaten für weitere Verarbeitung',
      icon: File,
      features: ['Einfach', 'Universal', 'Leichtgewichtig']
    },
  ];

  const handleGenerate = () => {
    setStatus('generating');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStatus('complete'), 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleReset = () => {
    setStatus('config');
    setProgress(0);
  };

  return (
    <div className="container mx-auto max-w-[1200px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2">Export & Vorlagengenerator</h2>
        <p className="text-muted-foreground">
          Exportieren Sie Ihre Budget-Daten in verschiedenen Formaten
        </p>
      </div>

      {/* Configuration */}
      {status === 'config' && (
        <div className="space-y-6">
          {/* Format Selection */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <h3>Format auswählen</h3>
              <CardDescription>Wählen Sie das gewünschte Exportformat</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={format} onValueChange={setFormat}>
                <div className="grid gap-4 md:grid-cols-3">
                  {formats.map((fmt) => (
                    <Card
                      key={fmt.id}
                      className={`cursor-pointer border-2 transition-colors ${
                        format === fmt.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => setFormat(fmt.id)}
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="rounded-lg bg-primary/10 p-3">
                            <fmt.icon className="h-6 w-6 text-primary" />
                          </div>
                          <RadioGroupItem value={fmt.id} id={fmt.id} />
                        </div>
                        <h4 className="mb-2">{fmt.name}</h4>
                        <p className="caption mb-3 text-muted-foreground">{fmt.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {fmt.features.map((feature) => (
                            <span 
                              key={feature} 
                              className="caption rounded bg-muted px-2 py-1 text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <h3>Exportoptionen</h3>
              <CardDescription>Passen Sie Ihren Export an</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Period Selection */}
                <div className="space-y-2">
                  <Label>Zeitraum</Label>
                  <RadioGroup 
                    value={options.period} 
                    onValueChange={(val) => setOptions({...options, period: val})}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center space-x-2 rounded-lg border border-border p-3">
                        <RadioGroupItem value="current" id="current" />
                        <Label htmlFor="current" className="flex-1 cursor-pointer">
                          Aktueller Monat
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border border-border p-3">
                        <RadioGroupItem value="quarter" id="quarter" />
                        <Label htmlFor="quarter" className="flex-1 cursor-pointer">
                          Aktuelles Quartal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border border-border p-3">
                        <RadioGroupItem value="year" id="year" />
                        <Label htmlFor="year" className="flex-1 cursor-pointer">
                          Gesamtes Jahr
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border border-border p-3">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="flex-1 cursor-pointer">
                          Benutzerdefiniert
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Branding Options */}
                {format !== 'csv' && (
                  <div className="space-y-4">
                    <Label>Branding</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="logo"
                            checked={options.includeLogo}
                            onCheckedChange={(checked) => 
                              setOptions({...options, includeLogo: checked as boolean})
                            }
                          />
                          <div>
                            <Label htmlFor="logo" className="cursor-pointer">
                              Logo einbinden
                            </Label>
                            <p className="caption text-muted-foreground">Fügt Ihr Logo im Kopfbereich ein</p>
                          </div>
                        </div>
                      </div>
                      
                      {format === 'pdf' && (
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id="charts"
                              checked={options.includeCharts}
                              onCheckedChange={(checked) => 
                                setOptions({...options, includeCharts: checked as boolean})
                              }
                            />
                            <div>
                              <Label htmlFor="charts" className="cursor-pointer">
                                Diagramme einbinden
                              </Label>
                              <p className="caption text-muted-foreground">Visualisierungen im PDF</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="footer"
                            checked={options.includeFooter}
                            onCheckedChange={(checked) => 
                              setOptions({...options, includeFooter: checked as boolean})
                            }
                          />
                          <div>
                            <Label htmlFor="footer" className="cursor-pointer">
                              Fusszeile mit Hinweis
                            </Label>
                            <p className="caption text-muted-foreground">
                              "Erstellt mit Budget Generator Pro"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Footer */}
                {options.includeFooter && format !== 'csv' && (
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Benutzerdefinierter Fusszeilen-Text (optional)</Label>
                    <Input
                      id="footerText"
                      placeholder="z.B. Ihr Firmenname oder Kontaktdaten"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between rounded-lg border-2 border-dashed border-border bg-muted p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      Vorschau verfügbar
                    </p>
                    <p className="caption text-muted-foreground">
                      Sehen Sie, wie Ihr Export aussehen wird
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  Vorschau anzeigen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Erweiterte Optionen
            </Button>
            <Button onClick={handleGenerate}>
              <Download className="mr-2 h-4 w-4" />
              Jetzt generieren
            </Button>
          </div>
        </div>
      )}

      {/* Generating */}
      {status === 'generating' && (
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 animate-pulse text-primary" />
              </div>
              <h3 className="mb-2">Export wird erstellt...</h3>
              <p className="mb-6 text-muted-foreground">
                Ihre Datei wird vorbereitet
              </p>
              <Progress value={progress} className="mb-2 h-2" />
              <p className="caption text-muted-foreground">{progress}% abgeschlossen</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete */}
      {status === 'complete' && (
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Export erfolgreich erstellt!</h3>
              <p className="mb-6 text-muted-foreground">
                Ihre Datei steht zum Download bereit
              </p>

              <div className="mb-6 mx-auto max-w-md">
                <Card className="border-border bg-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          Budget_Export_Oktober_2025.{format === 'excel' ? 'xlsx' : format}
                        </p>
                        <p className="caption text-muted-foreground">2.4 MB • Vor wenigen Sekunden</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Neuer Export
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Datei herunterladen
                </Button>
              </div>

              <Alert className="mt-6 border-primary/30 bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription>
                  <p className="caption">
                    Die Datei wird automatisch in Ihrem Download-Ordner gespeichert
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
