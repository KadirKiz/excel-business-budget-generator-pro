import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDown, CheckCircle } from 'lucide-react';
import { useExportStore } from '../store/slices/exportSlice';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { buildWorkbook, downloadXlsx, serializeCsv, downloadCsv } from '../lib/export';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from '../components/ui/sonner';

export function ExportGenerator() {
  const { t } = useTranslation();
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [brandName, setBrandName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1890ff');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const [sheetError, setSheetError] = useState(false);

  const { 
    target, 
    branding, 
    sheets, 
    progress, 
    status, 
    setTarget, 
    setBranding, 
    setSheets, 
    setProgress, 
    setStatus 
  } = useExportStore();

  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();

  const transactions = useDataStore((state) => state.transactions);
  const categories = useDataStore((state) => state.categories);
  const budgets = useDataStore((state) => state.budgets);

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    if (sheets.length === 0) {
      setSheetError(true);
      toast.error('Bitte wählen Sie mindestens ein Blatt für den Export');
      return;
    }
    setSheetError(false);

    setStatus('preparing');
    setProgress(10);

    try {
      const currentBranding = {
        brandName: brandName || undefined,
        primaryColorHex: primaryColor || undefined,
        logoDataUrl: logoDataUrl || undefined,
      };

      setBranding(currentBranding);

      if (target === 'excel') {
        // XLSX Export
        setProgress(30);
        const wb = await buildWorkbook(
          { type: 'xlsx', sheets, branding: currentBranding },
          { transactions, categories, budgets, locale, currency }
        );
        
        setProgress(80);
        const filename = `budget-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        await downloadXlsx(filename, wb);
        
        setProgress(100);
        toast.success('Export erfolgreich');
        setStatus('completed');
      } else {
        // CSV Export (per sheet)
        setProgress(30);
        
        if (sheets.includes('transactions')) {
          const csv = serializeCsv(
            transactions.map((tx) => {
              const category = categories.find((c) => c.id === tx.category);
              return {
                Date: tx.date.toLocaleDateString(locale),
                Description: tx.description,
                Category: category?.name || tx.category,
                Type: tx.type === 'income' ? 'Einnahme' : 'Ausgabe',
                Amount: tx.amount,
              };
            })
          );
          downloadCsv('transactions.csv', csv);
        }

        if (sheets.includes('categories')) {
          const csv = serializeCsv(
            categories.map((cat) => ({
              ID: cat.id,
              Name: cat.name,
              Type: cat.type === 'income' ? 'Einnahme' : cat.type === 'expense' ? 'Ausgabe' : 'Beide',
            }))
          );
          downloadCsv('categories.csv', csv);
        }

        if (sheets.includes('budgets')) {
          const csv = serializeCsv(
            budgets.flatMap((budget) =>
              budget.categories.map((cat) => ({
                'Category ID': cat.categoryId,
                Month: budget.startDate.toLocaleDateString(locale, { year: 'numeric', month: '2-digit' }),
                Budgeted: cat.budgeted,
              }))
            )
          );
          downloadCsv('budgets.csv', csv);
        }

        setProgress(100);
        toast.success('CSV-Exporte erfolgreich');
        setStatus('completed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Export fehlgeschlagen');
      setStatus('error');
    }
  };

  const toggleSheet = (sheet: 'transactions' | 'categories' | 'budgets' | 'summary') => {
    if (sheets.includes(sheet)) {
      const newSheets = sheets.filter((s) => s !== sheet);
      setSheets(newSheets);
      if (newSheets.length > 0) {
        setSheetError(false);
      }
    } else {
      setSheets([...sheets, sheet]);
      setSheetError(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export</h1>
        <p className="text-muted-foreground">Exportieren Sie Ihre Daten</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export-Optionen</CardTitle>
          <CardDescription>Wählen Sie Format, Blätter und Branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Type */}
          <div className="space-y-4">
            <Label>Export-Format</Label>
            <RadioGroup value={target} onValueChange={(value) => setTarget(value as 'excel' | 'csv')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="xlsx" />
                <Label htmlFor="xlsx">Excel (.xlsx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV (pro Blatt)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sheets Selection */}
          <div className="space-y-4">
            <Label>Zu exportierende Blätter *</Label>
            <div className={`space-y-2 p-4 border rounded-lg ${sheetError ? 'border-red-500' : 'border-border'}`}>
              {(['transactions', 'categories', 'budgets', 'summary'] as const).map((sheet) => (
                <div key={sheet} className="flex items-center space-x-2">
                  <Checkbox
                    id={sheet}
                    checked={sheets.includes(sheet)}
                    onCheckedChange={() => toggleSheet(sheet)}
                  />
                  <Label htmlFor={sheet} className="font-normal">
                    {sheet.charAt(0).toUpperCase() + sheet.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
            {sheetError && (
              <p className="text-sm text-red-500">Bitte wählen Sie mindestens ein Blatt für den Export</p>
            )}
          </div>

          {/* Branding */}
          <div className="space-y-4">
            <Label>Branding (optional)</Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandName">Firmenname</Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Meine Firma GmbH"
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">Primärfarbe</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-24 h-10"
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo (PNG/JPG)</Label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                >
                  Logo auswählen
                </Button>
                {logoDataUrl && (
                  <div className="mt-2">
                    <img src={logoDataUrl} alt="Logo" className="h-16 w-auto object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          {status === 'preparing' || status === 'generating' ? (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">Export wird erstellt...</p>
            </div>
          ) : (
            <Button onClick={handleExport} disabled={sheets.length === 0}>
              <FileDown className="mr-2 h-4 w-4" />
              Export starten
            </Button>
          )}

          {/* Info */}
          <div className="text-sm text-muted-foreground">
            Hinweis: Der Export enthält nur aktuell geladene Daten.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
