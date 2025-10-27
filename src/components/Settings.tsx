import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Save, 
  Download, 
  Upload, 
  Globe, 
  DollarSign, 
  Calendar,
  Shield,
  Bell,
  CheckCircle2
} from 'lucide-react';

export function Settings() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState({
    currency: 'chf',
    country: 'ch',
    dateFormat: 'dd.mm.yyyy',
    language: 'de-ch',
    notifications: true,
    telemetry: false,
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto max-w-[900px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2">Einstellungen</h2>
        <p className="text-muted-foreground">
          Passen Sie die App an Ihre Bedürfnisse an
        </p>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <Alert className="mb-6 border-primary/50 bg-primary/10">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription>
            <span className="body-small">Einstellungen erfolgreich gespeichert</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Regional Settings */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3>Regionale Einstellungen</h3>
            </div>
            <CardDescription>
              Währung, Sprache und Datumsformate
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Land</Label>
                  <Select 
                    value={settings.country} 
                    onValueChange={(val) => setSettings({...settings, country: val})}
                  >
                    <SelectTrigger id="country">
                      <SelectValue />
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
                  <Select 
                    value={settings.currency} 
                    onValueChange={(val) => setSettings({...settings, currency: val})}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Datumsformat</Label>
                  <Select 
                    value={settings.dateFormat} 
                    onValueChange={(val) => setSettings({...settings, dateFormat: val})}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd.mm.yyyy">DD.MM.YYYY (27.10.2025)</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY (10/27/2025)</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (2025-10-27)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(val) => setSettings({...settings, language: val})}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de-ch">Deutsch (Schweiz)</SelectItem>
                      <SelectItem value="de-de">Deutsch (Deutschland)</SelectItem>
                      <SelectItem value="en-us">English (US)</SelectItem>
                      <SelectItem value="fr-fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3>Benachrichtigungen</h3>
            </div>
            <CardDescription>
              Wann und wie Sie benachrichtigt werden möchten
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    Budget-Warnungen
                  </p>
                  <p className="caption text-muted-foreground">
                    Benachrichtigung bei Budgetüberschreitung
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    Monatliche Zusammenfassung
                  </p>
                  <p className="caption text-muted-foreground">
                    E-Mail-Bericht am Monatsende
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    Import-Bestätigungen
                  </p>
                  <p className="caption text-muted-foreground">
                    Benachrichtigung nach Datenimport
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3>Datenverwaltung</h3>
            </div>
            <CardDescription>
              Backup, Wiederherstellung und Datenschutz
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="body-small mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      Backup erstellen
                    </p>
                    <p className="caption text-muted-foreground">
                      Exportieren Sie alle Ihre Daten als Sicherungskopie
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Backup herunterladen
                </Button>
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="body-small mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      Backup wiederherstellen
                    </p>
                    <p className="caption text-muted-foreground">
                      Stellen Sie Ihre Daten aus einer Sicherungskopie wieder her
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Backup hochladen
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <p className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    Anonyme Nutzungsstatistiken
                  </p>
                  <p className="caption text-muted-foreground">
                    Helfen Sie uns, die App zu verbessern (keine persönlichen Daten)
                  </p>
                </div>
                <Switch
                  checked={settings.telemetry}
                  onCheckedChange={(checked) => setSettings({...settings, telemetry: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <h3>Über die App</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="caption text-muted-foreground">Version</span>
                <span className="caption">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="caption text-muted-foreground">Letztes Update</span>
                <span className="caption">25. Oktober 2025</span>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Dokumentation
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">
            Zurücksetzen
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </div>
  );
}
