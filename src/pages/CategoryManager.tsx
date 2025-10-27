import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
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
import type { Category } from '../types/finance';

export function CategoryManager() {
  const { t } = useTranslation();
  const categories = useDataStore((state) => state.categories);
  const addCategory = useDataStore((state) => state.addCategory);
  const deleteCategory = useDataStore((state) => state.deleteCategory);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'expense' as 'income' | 'expense' | 'both',
    color: '#3b82f6',
  });

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        id: category.id,
        name: category.name,
        type: category.type,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        id: '',
        name: '',
        type: 'expense',
        color: '#3b82f6',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const categoryData: Category = {
      id: editingCategory?.id || `category-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      color: formData.color,
    };

    if (editingCategory) {
      // Update existing
      deleteCategory(editingCategory.id);
      addCategory(categoryData);
    } else {
      // Add new
      addCategory(categoryData);
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (category: Category) => {
    if (window.confirm(`Kategorie "${category.name}" wirklich löschen?`)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kategorien</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Verwalten Sie Ihre Einnahmen- und Ausgabenkategorien
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Kategorie
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Kategorien</CardTitle>
          <CardDescription>
            {categories.length} Kategorie{categories.length !== 1 ? 'n' : ''} vorhanden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Farbe</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead className="w-[150px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <p className="font-semibold">Keine Kategorien vorhanden</p>
                        <p className="text-sm text-muted-foreground">
                          Erstellen Sie Ihre erste Kategorie
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Kategorie erstellen
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div
                          className="h-8 w-8 rounded-full border-2 border-border"
                          style={{ backgroundColor: category.color }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {category.type === 'income' && 'Einnahme'}
                          {category.type === 'expense' && 'Ausgabe'}
                          {category.type === 'both' && 'Beides'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
            </DialogTitle>
            <DialogDescription>
              Erstellen Sie eine neue Einnahmen- oder Ausgabenkategorie
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Lebensmittel"
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
                  <SelectItem value="both">Beides</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Farbe</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-24 h-12"
                />
                <div className="text-sm text-muted-foreground">
                  Wählen Sie eine Farbe zur visuellen Unterscheidung
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

