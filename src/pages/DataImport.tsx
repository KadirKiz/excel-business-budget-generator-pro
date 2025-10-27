import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useImportStore } from '../store/slices/importSlice';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { parseCsv, mapCsvRows } from '../lib/csv';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { toast } from '../components/ui/sonner';

type ImportStep = 'file' | 'mapping' | 'import';

export function DataImport() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<ImportStep>('file');

  // Store
  const {
    file,
    headers,
    preview,
    mapping,
    result,
    status,
    setFile,
    setHeaders,
    setRawRows,
    setMapping,
    setResult,
    setStatus,
    reset,
  } = useImportStore();

  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();

  const selectCategoryIndex = useDataStore((state) => state.selectCategoryIndex);
  const categoryIndex = selectCategoryIndex();
  const commitImportedTransactions = useDataStore((state) => state.commitImportedTransactions);

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      setStatus('parsing');
      const { headers: csvHeaders, rows } = await parseCsv(selectedFile);
      setFile(selectedFile);
      setHeaders(csvHeaders);
      setRawRows(rows);

      // Auto-detect mapping
      const autoMapping: typeof mapping = {
        date: csvHeaders.find((h) => h.toLowerCase().includes('datum') || h.toLowerCase().includes('date')) || csvHeaders[0],
        description: csvHeaders.find((h) => h.toLowerCase().includes('beschreibung') || h.toLowerCase().includes('desc')) || csvHeaders[1],
        amount: csvHeaders.find((h) => h.toLowerCase().includes('betrag') || h.toLowerCase().includes('amount')) || csvHeaders[2],
        category: csvHeaders.find((h) => h.toLowerCase().includes('kategorie') || h.toLowerCase().includes('category')),
      };
      setMapping(autoMapping);
      setStatus('mapped');
      setCurrentStep('mapping');
    } catch (error) {
      console.error(error);
      toast.error('Fehler beim Parsen der CSV-Datei');
      setStatus('error');
    }
  };

  // Handle import
  const handleImport = () => {
    if (!mapping || !file) return;

    setStatus('committing');
    const { headers, rawRows } = useImportStore.getState();
    const { valid, errors } = mapCsvRows(rawRows, mapping, locale, currency, categoryIndex);

    setResult({
      ok: valid.length,
      failed: errors.length,
      errors,
    });

    if (valid.length > 0) {
      commitImportedTransactions(valid);
      toast.success(`${valid.length} Transaktionen importiert`);
      setCurrentStep('import');
    }

    if (errors.length > 0) {
      toast.warning(`${errors.length} Zeilen konnten nicht importiert werden`);
    }

    setStatus('done');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daten importieren</h1>
        <p className="text-muted-foreground">Importieren Sie Transaktionsdaten aus einer CSV-Datei</p>
      </div>

      {/* Step 1: File Selection */}
      {currentStep === 'file' && (
        <Card>
          <CardHeader>
            <CardTitle>CSV-Datei auswählen</CardTitle>
            <CardDescription>Wählen Sie eine CSV-Datei mit Transaktionsdaten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-dashed border-2 border-border rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Ziehen Sie eine CSV-Datei hierher oder klicken Sie, um auszuwählen
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Datei auswählen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mapping */}
      {currentStep === 'mapping' && mapping && (
        <Card>
          <CardHeader>
            <CardTitle>Spalten zuordnen</CardTitle>
            <CardDescription>Ordnen Sie die CSV-Spalten den Feldern zu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label>Datum</Label>
                  <Select value={mapping.date} onValueChange={(value) => setMapping({ ...mapping, date: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Beschreibung</Label>
                  <Select value={mapping.description} onValueChange={(value) => setMapping({ ...mapping, description: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Betrag</Label>
                  <Select value={mapping.amount} onValueChange={(value) => setMapping({ ...mapping, amount: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {mapping.category && (
                  <div>
                    <Label>Kategorie (optional)</Label>
                    <Select value={mapping.category || ''} onValueChange={(value) => setMapping({ ...mapping, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-- Auslassen --</SelectItem>
                        {headers.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div>
                <Label>Vorschau (erste 10 Zeilen)</Label>
                <div className="border rounded-md p-4 space-y-2 max-h-96 overflow-auto">
                  {preview.slice(0, 10).map((row, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-medium">Zeile {idx + 1}</div>
                      <div className="text-muted-foreground">
                        Datum: {row[mapping.date]}
                      </div>
                      <div className="text-muted-foreground">
                        Beschreibung: {row[mapping.description]}
                      </div>
                      <div className="text-muted-foreground">
                        Betrag: {row[mapping.amount]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setCurrentStep('file')}>Zurück</Button>
              <Button onClick={handleImport} disabled={status === 'committing'}>
                Import starten
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Import Result */}
      {currentStep === 'import' && result && (
        <Card>
          <CardHeader>
            <CardTitle>Import abgeschlossen</CardTitle>
            <CardDescription>Ergebnis der Imports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Erfolgreich importiert: {result.ok}</span>
            </div>

            {result.failed > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Fehlgeschlagen: {result.failed}</span>
              </div>
            )}

            {result.errors.length > 0 && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Fehler:</p>
                    {result.errors.slice(0, 5).map((e, idx) => (
                      <p key={idx} className="text-sm">
                        Zeile {e.row}: {e.reason}
                      </p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={() => navigate('/dashboard')}>
                Zum Dashboard
              </Button>
              <Button variant="outline" onClick={() => { reset(); setCurrentStep('file'); }}>
                Neu starten
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
