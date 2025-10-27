import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useDataStore } from '../store/slices/dataSlice';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loadDemoData = useDataStore((state) => state.loadDemoData);

  const handleStart = () => {
    navigate('/setup');
  };

  const handleLoadDemo = () => {
    loadDemoData();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            {t('welcome.title', 'Excel Business Budget Generator Pro')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('welcome.subtitle', 'Professionelle Budgetverwaltung für Ihr Unternehmen')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Automatische Budget-Erstellung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Erstellen Sie Budgets basierend auf historischen Daten
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intelligente Kategorisierung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatische Kategorisierung von Transaktionen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detaillierte Analysen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Umfassende Reports und Visualisierungen
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={handleStart} className="text-lg px-8 py-6">
            {t('welcome.startSetup', 'Setup starten')}
          </Button>
          <Button size="lg" variant="outline" onClick={handleLoadDemo} className="text-lg px-8 py-6">
            Demo laden
          </Button>
        </div>
      </div>
    </div>
  );
}

