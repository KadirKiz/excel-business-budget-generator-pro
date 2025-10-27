import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface DataImportProps {
  onComplete: () => void;
}

export function DataImport({ onComplete }: DataImportProps) {
  const [step, setStep] = useState<'select' | 'mapping' | 'importing' | 'complete'>('select');
  const [source, setSource] = useState('');
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Array<{row: number; message: string}>>([]);

  const sources = [
    { id: 'csv', label: 'CSV-Datei', icon: FileSpreadsheet, description: 'Importieren Sie Daten aus einer CSV-Datei' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Importieren Sie aus .xlsx oder .xls Dateien' },
    { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet, description: 'Verbinden Sie Ihr Google Sheets' },
  ];

  const sampleData = [
    { source: 'Datum', target: 'Datum', mapped: true },
    { source: 'Beschreibung', target: 'Beschreibung', mapped: true },
    { source: 'Betrag', target: 'Betrag', mapped: true },
    { source: 'Konto', target: 'Konto', mapped: true },
    { source: 'Typ', target: 'Kategorie', mapped: false },
  ];

  const previewRows = [
    ['01.10.2025', 'Miete Oktober', '-1200.00', 'Girokonto', 'Wohnen'],
    ['05.10.2025', 'Gehalt', '4500.00', 'Girokonto', 'Einkommen'],
    ['12.10.2025', 'Lebensmittel', '-85.50', 'Kreditkarte', 'Nahrung'],
  ];

  const handleSourceSelect = (sourceId: string) => {
    setSource(sourceId);
    setTimeout(() => setStep('mapping'), 500);
  };

  const handleStartImport = () => {
    setStep('importing');
    setErrors([
      { row: 15, message: 'Ungültiges Datumsformat' },
      { row: 23, message: 'Fehlender Betrag' },
    ]);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('complete'), 500);
      }
    }, 200);
  };

  return (
    <div className="container mx-auto max-w-[1200px] p-4 md:p-8">
      <div className="mb-8">
        <h2 className="mb-2">Daten importieren</h2>
        <p className="text-muted-foreground">
          Importieren Sie Ihre Transaktionen aus verschiedenen Quellen
        </p>
      </div>

      {/* Select Source */}
      {step === 'select' && (
        <div className="grid gap-4 md:grid-cols-3">
          {sources.map((src) => (
            <Card
              key={src.id}
              className="cursor-pointer border-2 border-border transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleSourceSelect(src.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <src.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="mb-2">{src.label}</h4>
                <p className="caption text-muted-foreground">{src.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mapping */}
      {step === 'mapping' && (
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <h3>Felderzuordnung</h3>
              <CardDescription>
                Ordnen Sie die Spalten aus Ihrer Quelle den Zielfeldern zu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sampleData.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="mb-1 block">Quellfeld</Label>
                      <div className="rounded-md border border-border bg-muted px-3 py-2">
                        <p className="body-small">{field.source}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor={`target-${idx}`} className="mb-1 block">Zielfeld</Label>
                      <Select defaultValue={field.target}>
                        <SelectTrigger id={`target-${idx}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Datum">Datum</SelectItem>
                          <SelectItem value="Beschreibung">Beschreibung</SelectItem>
                          <SelectItem value="Betrag">Betrag</SelectItem>
                          <SelectItem value="Konto">Konto</SelectItem>
                          <SelectItem value="Kategorie">Kategorie</SelectItem>
                          <SelectItem value="ignore">Ignorieren</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      {field.mapped ? (
                        <Badge variant="default" className="bg-primary">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          OK
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Offen
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <h4>Datenvorschau (erste 3 Zeilen)</h4>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead className="text-right">Betrag</TableHead>
                    <TableHead>Konto</TableHead>
                    <TableHead>Kategorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, idx) => (
                    <TableRow key={idx}>
                      {row.map((cell, cellIdx) => (
                        <TableCell 
                          key={cellIdx} 
                          className={cellIdx === 2 ? 'text-right' : ''}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep('select')}>
              Abbrechen
            </Button>
            <Button onClick={handleStartImport}>
              Import starten
            </Button>
          </div>
        </div>
      )}

      {/* Importing */}
      {step === 'importing' && (
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 animate-pulse text-primary" />
              </div>
              <h3 className="mb-2">Daten werden importiert...</h3>
              <p className="mb-6 text-muted-foreground">
                {progress < 100 ? `${progress}% abgeschlossen` : 'Finalisierung...'}
              </p>
              <Progress value={progress} className="mb-6 h-2" />
              
              {errors.length > 0 && (
                <Alert className="mb-4 text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="body-small mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {errors.length} Zeilen mit Fehlern gefunden
                    </p>
                    <ul className="caption space-y-1 text-muted-foreground">
                      {errors.map((error, idx) => (
                        <li key={idx}>Zeile {error.row}: {error.message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Import erfolgreich!</h3>
              <p className="mb-6 text-muted-foreground">
                245 Transaktionen wurden erfolgreich importiert
              </p>
              
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="caption mb-1 text-muted-foreground">Importiert</p>
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-semibold)' }}>245</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="caption mb-1 text-muted-foreground">Übersprungen</p>
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-semibold)' }}>2</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <p className="caption mb-1 text-muted-foreground">Duplikate</p>
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-semibold)' }}>8</p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setStep('select')}>
                  Weitere Daten importieren
                </Button>
                <Button onClick={onComplete}>
                  Zum Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
