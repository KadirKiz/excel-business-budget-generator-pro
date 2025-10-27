import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Target, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { useGoalsStore, type Goal } from '../store/slices/goalsSlice';
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

import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../lib/format';
import { useAppConfigStore } from '../store/slices/appConfigSlice';

const GOAL_TYPES = [
  { value: 'revenue', label: 'Umsatzziel', icon: TrendingUp },
  { value: 'expense', label: 'Ausgabenziel', icon: TrendingDown },
  { value: 'savings', label: 'Sparziel', icon: Target },
  { value: 'profit', label: 'Gewinnziel', icon: CheckCircle },
] as const;

export function GoalsManager() {
  const { t } = useTranslation();
  const goals = useGoalsStore((state) => state.goals);
  const addGoal = useGoalsStore((state) => state.addGoal);
  const updateGoal = useGoalsStore((state) => state.updateGoal);
  const removeGoal = useGoalsStore((state) => state.removeGoal);
  const updateGoalsProgress = useGoalsStore((state) => state.updateGoalsProgress);
  const transactions = useDataStore((state) => state.transactions);
  const categories = useDataStore((state) => state.categories);
  const { selectLocaleCurrency } = useAppConfigStore();
  const { locale, currency } = selectLocaleCurrency();

  // Update goals progress when transactions change
  useEffect(() => {
    updateGoalsProgress(transactions);
  }, [transactions, updateGoalsProgress]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'revenue' as Goal['type'],
    target: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    categoryId: '',
    description: '',
  });

  const activeGoals = goals.filter((g) => g.status !== 'completed');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const goalStats = useMemo(() => {
    const total = goals.length;
    const completed = completedGoals.length;
    const onTrack = goals.filter((g) => g.status === 'on-track').length;
    const atRisk = goals.filter((g) => g.status === 'at-risk').length;
    const behind = goals.filter((g) => g.status === 'behind').length;
    
    return { total, completed, onTrack, atRisk, behind };
  }, [goals, completedGoals]);

  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        type: goal.type,
        target: goal.target.toString(),
        startDate: new Date(goal.startDate).toISOString().split('T')[0],
        deadline: new Date(goal.deadline).toISOString().split('T')[0],
        categoryId: goal.categoryId || '',
        description: goal.description || '',
      });
    } else {
      setEditingGoal(null);
      setFormData({
        name: '',
        type: 'revenue',
        target: '',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        categoryId: '',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.target || !formData.deadline) return;

    const goalData: Goal = {
      id: editingGoal?.id || crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      target: parseFloat(formData.target),
      current: 0,
      startDate: new Date(formData.startDate),
      deadline: new Date(formData.deadline),
      categoryId: formData.categoryId || undefined,
      description: formData.description || undefined,
      progress: 0,
      status: 'on-track',
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }

    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  const handleDelete = (goal: Goal) => {
    if (window.confirm(`Ziel "${goal.name}" wirklich löschen?`)) {
      removeGoal(goal.id);
    }
  };

  const getStatusBadgeVariant = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return 'default';
      case 'at-risk':
        return 'secondary';
      case 'behind':
        return 'destructive';
      case 'completed':
        return 'default';
    }
  };

  const getStatusLabel = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return 'Im Plan';
      case 'at-risk':
        return 'Risiko';
      case 'behind':
        return 'Zurück';
      case 'completed':
        return 'Abgeschlossen';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ziele</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Definieren und tracken Sie Ihre Finanzziele
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Ziel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gesamt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Im Plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{goalStats.onTrack}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Risiko</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{goalStats.atRisk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Zurück</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{goalStats.behind}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Abgeschlossen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{goalStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Ziele</CardTitle>
          <CardDescription>
            {activeGoals.length} aktive, {completedGoals.length} abgeschlossen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead className="text-right">Ziel</TableHead>
                  <TableHead className="text-right">Fortschritt</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Target className="h-16 w-16 text-muted-foreground" />
                        <p className="font-semibold">Keine Ziele vorhanden</p>
                        <p className="text-sm text-muted-foreground">
                          Erstellen Sie Ihr erstes Ziel
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Ziel erstellen
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  goals.map((goal) => {
                    const TypeIcon = GOAL_TYPES.find((t) => t.value === goal.type)?.icon || Target;
                    return (
                      <TableRow key={goal.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            {goal.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">
                            {GOAL_TYPES.find((t) => t.value === goal.type)?.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(goal.target, currency, locale)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={goal.progress} className="w-24" />
                            <span className="text-sm text-muted-foreground w-12">
                              {goal.progress.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(goal.deadline).toLocaleDateString(locale)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(goal.status)}>
                            {getStatusLabel(goal.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(goal)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(goal)}
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

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Ziel bearbeiten' : 'Neues Ziel'}
            </DialogTitle>
            <DialogDescription>
              Definieren Sie ein neues Finanzziel (Umsatz, Ausgaben, Sparziel, etc.)
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
                  placeholder="z.B. Monatliches Umsatzziel"
                />
              </div>

              <div>
                <Label htmlFor="type">Zieltyp *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="target">Zielbetrag *</Label>
                <Input
                  id="target"
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="z.B. 10000"
                  min="0"
                  step="0.01"
                />
              </div>

              {categories.length > 0 && (
                <div>
                  <Label htmlFor="categoryId">Kategorie (optional)</Label>
                  <Select
                    value={formData.categoryId || undefined}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Keine Kategorie" />
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
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Startdatum</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="z.B. Monatliches Umsatzziel von 10.000 CHF"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.target || !formData.deadline}
            >
              <Target className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

