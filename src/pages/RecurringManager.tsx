import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Calendar, Repeat, Pause, Play } from 'lucide-react';
import { useRecurringStore, type RecurringTransaction } from '../store/slices/recurringSlice';
import { useDataStore } from '../store/slices/dataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatDate } from '../lib/format';
import { getFrequencyLabel } from '../lib/recurring';
import { useAppConfigStore } from '../store/slices/appConfigSlice';

export function RecurringManager() {
  const { t } = useTranslation();
  const recurrings = useRecurringStore((state) => state.recurrings);
  const addRecurring = useRecurringStore((state) => state.addRecurring);
  const updateRecurring = useRecurringStore((state) => state.updateRecurring);
  const removeRecurring = useRecurringStore((state) => state.removeRecurring);
  const toggleActive = useRecurringStore((state) => state.toggleActive);
  const categories = useDataStore((state) => state.categories);
  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'monthly' as RecurringTransaction['frequency'],
    amount: '',
    category: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const activeRecurrings = recurrings.filter((r) => r.isActive);
  const inactiveRecurrings = recurrings.filter((r) => !r.isActive);

  const handleOpenDialog = (recurring?: RecurringTransaction) => {
    if (recurring) {
      setEditingRecurring(recurring);
      setFormData({
        name: recurring.name,
        frequency: recurring.frequency,
        amount: recurring.amount.toString(),
        category: recurring.category,
        description: recurring.description,
        type: recurring.type,
        startDate: new Date(recurring.startDate).toISOString().split('T')[0],
        endDate: recurring.endDate ? new Date(recurring.endDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingRecurring(null);
      setFormData({
        name: '',
        frequency: 'monthly',
        amount: '',
        category: '',
        description: '',
        type: 'expense',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.amount || !formData.category) return;

    const recurringData: RecurringTransaction = {
      id: editingRecurring?.id || crypto.randomUUID(),
      name: formData.name,
      frequency: formData.frequency,
      amount: parseFloat(formData.amount),
      currency: currency,
      category: formData.category,
      description: formData.description || formData.name,
      type: formData.type,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      nextOccurrence: new Date(formData.startDate),
      isActive: true,
      generatedCount: 0,
    };

    if (editingRecurring) {
      updateRecurring(editingRecurring.id, recurringData);
    } else {
      addRecurring(recurringData);
    }

    setIsDialogOpen(false);
    setEditingRecurring(null);
  };

  const handleDelete = (recurring: RecurringTransaction) => {
    if (window.confirm(`Wiederkehrende Zahlung "${recurring.name}" wirklich löschen?`)) {
      removeRecurring(recurring.id);
    }
  };

  const filteredRecurrings = activeRecurrings.length > 0 || inactiveRecurrings.length > 0
    ? recurrings
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wiederkehrende Zahlungen</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Verwalten Sie regelmäßige Einnahmen und Ausgaben
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Zahlung
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gesamt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recurrings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aktiv</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRecurrings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pausiert</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{inactiveRecurrings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recurrings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle wiederkehrenden Zahlungen</CardTitle>
          <CardDescription>
            {activeRecurrings.length} aktiv, {inactiveRecurrings.length} pausiert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Häufigkeit</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead>Nächste</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecurrings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Repeat className="h-16 w-16 text-muted-foreground" />
                        <p className="font-semibold">Keine wiederkehrenden Zahlungen</p>
                        <p className="text-sm text-muted-foreground">
                          Erstellen Sie Ihre erste wiederkehrende Zahlung
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Zahlung erstellen
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecurrings.map((recurring) => (
                    <TableRow key={recurring.id}>
                      <TableCell className="font-medium">{recurring.name}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${recurring.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {recurring.type === 'income' ? 'Einnahme' : 'Ausgabe'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Repeat className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{getFrequencyLabel(recurring.frequency)}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${recurring.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {recurring.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(recurring.amount), recurring.currency, locale)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{formatDate(recurring.nextOccurrence, locale)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={recurring.isActive ? 'default' : 'secondary'}>
                          {recurring.isActive ? 'Aktiv' : 'Pausiert'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(recurring.id)}
                            title={recurring.isActive ? 'Pausieren' : 'Aktivieren'}
                          >
                            {recurring.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(recurring)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(recurring)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRecurring ? 'Wiederkehrende Zahlung bearbeiten' : 'Neue wiederkehrende Zahlung'}
            </DialogTitle>
            <DialogDescription>
              Erstellen Sie eine regelmäßige Einnahme oder Ausgabe
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Miete"
                />
              </div>

              <div>
                <Label htmlFor="type">Typ *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Einnahme</SelectItem>
                    <SelectItem value="expense">Ausgabe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="amount">Betrag *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="z.B. 1500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Häufigkeit *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Täglich</SelectItem>
                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                    <SelectItem value="monthly">Monatlich</SelectItem>
                    <SelectItem value="quarterly">Quartalsweise</SelectItem>
                    <SelectItem value="yearly">Jährlich</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Kategorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="z.B. Monatliche Miete für Büro"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Startdatum *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Enddatum (optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.amount || !formData.category}
            >
              <Repeat className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

