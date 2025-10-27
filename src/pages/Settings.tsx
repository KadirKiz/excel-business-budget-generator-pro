import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { useModulesStore } from '../store/slices/modulesSlice';
import { useAlertsStore } from '../store/slices/alertsSlice';
import { exportAppStateAsFile, importAppStateFromFile, clearAppState } from '../lib/persistence';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Download, Upload, Trash2 } from 'lucide-react';
import { toast } from '../components/ui/sonner';

export function Settings() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const config = useAppConfigStore();
  const transactions = useDataStore((state) => state.transactions);
  const categories = useDataStore((state) => state.categories);

  const handleExport = async () => {
    try {
      await exportAppStateAsFile();
      toast.success('Backup erfolgreich heruntergeladen');
    } catch (error) {
      console.error(error);
      toast.error('Fehler beim Export');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const state = await importAppStateFromFile(file);
      
      // Confirm before overwriting
      const confirmed = window.confirm(
        `Backup wird geladen:\n- ${state.data?.transactions.length || 0} Transaktionen\n- ${state.data?.categories.length || 0} Kategorien\n\nAktuelle Daten werden überschrieben. Fortfahren?`
      );

      if (confirmed) {
        // Restore state (same logic as hydrateStores)
        if (state.appConfig) {
          useAppConfigStore.getState().updateConfig(state.appConfig);
        }
        if (state.data) {
          useDataStore.setState({
            transactions: state.data.transactions,
            categories: state.data.categories,
            budgets: state.data.budgets,
          });
        }
        if (state.modules) {
          useModulesStore.setState(state.modules);
        }
        if (state.alerts) {
          useAlertsStore.setState({ alerts: state.alerts });
        }

        toast.success('Backup erfolgreich geladen');
        
        // Suggest reload
        if (window.confirm('App neu laden, um Änderungen zu sehen?')) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Fehler beim Import');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm(
      'Alle lokalen Daten löschen? Dies kann nicht rückgängig gemacht werden.'
    );
    
    if (confirmed) {
      try {
        await clearAppState();
        window.location.reload();
      } catch (error) {
        console.error(error);
        toast.error('Fehler beim Löschen');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">Verwalten Sie Ihre App-Einstellungen</p>
      </div>

      <div className="grid gap-4">
        {/* Allgemein */}
        <Card>
          <CardHeader>
            <CardTitle>Allgemein</CardTitle>
            <CardDescription>Grundlegende Einstellungen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Währung: {config.currency}</Label>
            </div>
            <div>
              <Label>Sprache: {config.locale}</Label>
            </div>
            <div>
              <Label>Zweck: {config.purpose}</Label>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card>
          <CardHeader>
            <CardTitle>Backup & Wiederherstellung</CardTitle>
            <CardDescription>Sichern Sie Ihre Daten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Daten werden automatisch lokal gespeichert (IndexedDB).
              </p>
              <p className="text-sm text-muted-foreground">
                Aktuelle Daten: {transactions.length} Transaktionen, {categories.length} Kategorien
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={handleExport} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Backup erstellen
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
                disabled={isImporting}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? 'Importiere...' : 'Wiederherstellen'}
              </Button>

              <Button
                onClick={handleClear}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Alle Daten löschen
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Datenschutz:</strong> Alle Daten werden ausschließlich lokal in Ihrem Browser gespeichert.
                Keine Daten werden an Server übertragen.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

