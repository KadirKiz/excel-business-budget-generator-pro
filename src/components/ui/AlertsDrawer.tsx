import { useTranslation } from 'react-i18next';
import { useAlertsStore } from '../../store/slices/alertsSlice';
import { AlertCircle, CheckCircle2, XCircle, Bell } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

export function AlertsDrawer() {
  const { t } = useTranslation();
  const alerts = useAlertsStore((state) => state.alerts);
  const resolveAlert = useAlertsStore((state) => state.resolveAlert);
  const dismissAlert = useAlertsStore((state) => state.dismissAlert);

  const unreadCount = alerts.filter((a) => !a.resolved).length;
  const activeAlerts = alerts.filter((a) => !a.resolved);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Kritisch</Badge>;
      case 'warning':
        return <Badge variant="default">Warnung</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alerts</SheetTitle>
          <SheetDescription>Übersicht über alle Warnungen und Hinweise</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Keine aktiven Alerts
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Als erledigt markieren
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Ignorieren
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

