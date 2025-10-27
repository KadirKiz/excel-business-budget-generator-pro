import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, TrendingDown, CreditCard, Calendar } from 'lucide-react';
import { useDebtsStore, type Debt } from '../store/slices/debtsSlice';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { formatCurrency, formatDate } from '../lib/format';
import { useAppConfigStore } from '../store/slices/appConfigSlice';

export function DebtsManager() {
  const { t } = useTranslation();
  const debts = useDebtsStore((state) => state.debts);
  const addDebt = useDebtsStore((state) => state.addDebt);
  const updateDebt = useDebtsStore((state) => state.updateDebt);
  const removeDebt = useDebtsStore((state) => state.removeDebt);
  const addPayment = useDebtsStore((state) => state.addPayment);
  const selectTotalDebtAmount = useDebtsStore((state) => state.selectTotalDebtAmount);
  const selectMonthlyDebtPayments = useDebtsStore((state) => state.selectMonthlyDebtPayments);
  
  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();

  const totalDebt = selectTotalDebtAmount();
  const monthlyPayments = selectMonthlyDebtPayments();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    creditor: '',
    totalAmount: '',
    monthlyPayment: '',
    interestRate: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    status: 'active' as Debt['status'],
  });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const activeDebts = debts.filter((d) => d.status === 'active');
  const paidOffDebts = debts.filter((d) => d.status === 'paid-off');

  const handleOpenDialog = (debt?: Debt) => {
    if (debt) {
      setEditingDebt(debt);
      setFormData({
        name: debt.name,
        creditor: debt.creditor,
        totalAmount: debt.totalAmount.toString(),
        monthlyPayment: debt.monthlyPayment.toString(),
        interestRate: debt.interestRate.toString(),
        startDate: new Date(debt.startDate).toISOString().split('T')[0],
        endDate: debt.endDate ? new Date(debt.endDate).toISOString().split('T')[0] : '',
        notes: debt.notes || '',
        status: debt.status,
      });
    } else {
      setEditingDebt(null);
      setFormData({
        name: '',
        creditor: '',
        totalAmount: '',
        monthlyPayment: '',
        interestRate: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: '',
        status: 'active',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.creditor || !formData.totalAmount || !formData.monthlyPayment) {
      return;
    }

    const debtData = {
      name: formData.name,
      creditor: formData.creditor,
      totalAmount: parseFloat(formData.totalAmount),
      currency: currency,
      monthlyPayment: parseFloat(formData.monthlyPayment),
      interestRate: parseFloat(formData.interestRate) || 0,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      notes: formData.notes || undefined,
    };

    if (editingDebt) {
      updateDebt(editingDebt.id, { ...debtData, status: formData.status });
    } else {
      addDebt(debtData);
    }

    setIsDialogOpen(false);
    setEditingDebt(null);
  };

  const handleDelete = (debt: Debt) => {
    if (window.confirm(`Schulden "${debt.name}" wirklich löschen?`)) {
      removeDebt(debt.id);
    }
  };

  const handleOpenPaymentDialog = (debt: Debt) => {
    setSelectedDebtForPayment(debt);
    setPaymentAmount('');
    setPaymentNotes('');
    setIsPaymentDialogOpen(true);
  };

  const handleProcessPayment = () => {
    if (!selectedDebtForPayment || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) return;

    addPayment(selectedDebtForPayment.id, amount, paymentNotes || undefined);
    setIsPaymentDialogOpen(false);
    setSelectedDebtForPayment(null);
  };

  const getStatusBadge = (status: Debt['status']) => {
    const variants = {
      active: 'default',
      'paid-off': 'secondary',
      overdue: 'destructive',
      negotiating: 'outline',
    } as const;

    const labels = {
      active: 'Aktiv',
      'paid-off': 'Abgezahlt',
      overdue: 'Überfällig',
      negotiating: 'Verhandlung',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Schulden-Verwaltung</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Verwalten Sie Ihre Verbindlichkeiten und Tilgungspläne
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Schuld
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gesamtschulden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt, currency, locale)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {debts.filter((d) => d.status === 'active').length} aktive Schulden
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monatliche Tilgung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyPayments, currency, locale)}</div>
            <p className="text-xs text-muted-foreground mt-1">Gesamttilgung pro Monat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Abbezahlt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidOffDebts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Abgeschlossene Schulden</p>
          </CardContent>
        </Card>
      </div>

      {/* Debts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Schulden</CardTitle>
          <CardDescription>
            {activeDebts.length} aktiv, {paidOffDebts.length} abgezahlt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gläubiger</TableHead>
                  <TableHead className="text-right">Gesamtbetrag</TableHead>
                  <TableHead className="text-right">Aktueller Stand</TableHead>
                  <TableHead className="text-right">Monatliche Rate</TableHead>
                  <TableHead className="text-right">Zinssatz</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[180px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <TrendingDown className="h-16 w-16 text-muted-foreground" />
                        <p className="font-semibold">Keine Schulden vorhanden</p>
                        <p className="text-sm text-muted-foreground">
                          Erstellen Sie Ihre erste Schuld
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Schuld erstellen
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  debts.map((debt) => {
                    const progress = debt.totalAmount > 0 
                      ? ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100 
                      : 0;

                    return (
                      <TableRow key={debt.id}>
                        <TableCell className="font-medium">{debt.name}</TableCell>
                        <TableCell>{debt.creditor}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(debt.totalAmount, debt.currency, locale)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <div className="font-semibold">{formatCurrency(debt.currentBalance, debt.currency, locale)}</div>
                            <Progress value={progress} className="h-1 w-20" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(debt.monthlyPayment, debt.currency, locale)}
                        </TableCell>
                        <TableCell className="text-right">{debt.interestRate.toFixed(2)}%</TableCell>
                        <TableCell>{getStatusBadge(debt.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenPaymentDialog(debt)}
                              disabled={debt.status === 'paid-off'}
                              title="Zahlung hinzufügen"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(debt)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(debt)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Debt Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDebt ? 'Schuld bearbeiten' : 'Neue Schuld'}
            </DialogTitle>
            <DialogDescription>
              Erstellen Sie eine neue Schuld oder bearbeiten Sie eine bestehende
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
                  placeholder="z.B. Autokredit"
                />
              </div>

              <div>
                <Label htmlFor="creditor">Gläubiger *</Label>
                <Input
                  id="creditor"
                  value={formData.creditor}
                  onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
                  placeholder="z.B. ABC Bank"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="totalAmount">Gesamtbetrag *</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="z.B. 25000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="monthlyPayment">Monatliche Rate *</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  value={formData.monthlyPayment}
                  onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                  placeholder="z.B. 500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Zinssatz (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="z.B. 3.5"
                  min="0"
                  step="0.1"
                />
              </div>
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

            {editingDebt && (
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Debt['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="paid-off">Abgezahlt</SelectItem>
                    <SelectItem value="overdue">Überfällig</SelectItem>
                    <SelectItem value="negotiating">In Verhandlung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notizen</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Zusätzliche Informationen"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.creditor || !formData.totalAmount || !formData.monthlyPayment}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zahlung hinzufügen</DialogTitle>
            <DialogDescription>
              {selectedDebtForPayment && (
                <>
                  Schuld: {selectedDebtForPayment.name}<br />
                  Aktueller Stand: {formatCurrency(selectedDebtForPayment.currentBalance, selectedDebtForPayment.currency, locale)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="paymentAmount">Zahlungsbetrag *</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="z.B. 500"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="paymentNotes">Notizen</Label>
              <Input
                id="paymentNotes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Zusätzliche Informationen zur Zahlung"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
            >
              Zahlung verbuchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

