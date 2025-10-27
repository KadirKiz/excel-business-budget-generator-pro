import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { Search, Filter, Download, Trash2, Edit, Plus } from 'lucide-react';

export function TransactionLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const transactions = [
    { id: 1, date: '27.10.2025', description: 'Miete Oktober', category: 'Wohnen', account: 'Girokonto', amount: -1200.00, status: 'completed' },
    { id: 2, date: '26.10.2025', description: 'Lebensmittel Coop', category: 'Nahrung', account: 'Kreditkarte', amount: -85.50, status: 'completed' },
    { id: 3, date: '25.10.2025', description: 'Gehalt Oktober', category: 'Einkommen', account: 'Girokonto', amount: 4500.00, status: 'completed' },
    { id: 4, date: '24.10.2025', description: 'Strom & Gas', category: 'Wohnen', account: 'Girokonto', amount: -145.00, status: 'completed' },
    { id: 5, date: '23.10.2025', description: 'Netflix Abo', category: 'Unterhaltung', account: 'Kreditkarte', amount: -17.90, status: 'pending' },
    { id: 6, date: '22.10.2025', description: 'Tankstelle', category: 'Transport', account: 'Kreditkarte', amount: -75.00, status: 'completed' },
    { id: 7, date: '21.10.2025', description: 'Restaurant', category: 'Nahrung', account: 'Kreditkarte', amount: -65.50, status: 'completed' },
    { id: 8, date: '20.10.2025', description: 'Fitness Abo', category: 'Gesundheit', account: 'Girokonto', amount: -59.00, status: 'completed' },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(transactions.map(t => t.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Wohnen': 'bg-chart-1',
      'Nahrung': 'bg-chart-2',
      'Transport': 'bg-chart-3',
      'Unterhaltung': 'bg-chart-4',
      'Gesundheit': 'bg-chart-5',
      'Einkommen': 'bg-primary',
    };
    return colors[category] || 'bg-muted';
  };

  return (
    <div className="container mx-auto max-w-[1200px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2">Transaktionen</h2>
        <p className="text-muted-foreground">Alle Buchungen im Überblick</p>
      </div>

      {/* Toolbar */}
      <Card className="mb-6 border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Transaktionen durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  <SelectItem value="wohnen">Wohnen</SelectItem>
                  <SelectItem value="nahrung">Nahrung</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="unterhaltung">Unterhaltung</SelectItem>
                  <SelectItem value="gesundheit">Gesundheit</SelectItem>
                  <SelectItem value="einkommen">Einkommen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Neue Transaktion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="mb-4 border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="body-small">
                <strong>{selectedItems.length}</strong> Transaktion{selectedItems.length > 1 ? 'en' : ''} ausgewählt
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Bearbeiten
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Löschen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === transactions.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Konto</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-b border-border">
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(transaction.id)}
                      onCheckedChange={(checked) => handleSelectItem(transaction.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="body-small">{transaction.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className="body-small" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {transaction.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getCategoryColor(transaction.category)} caption text-white`}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="caption text-muted-foreground">{transaction.account}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      className="body-small"
                      style={{ 
                        fontWeight: 'var(--font-weight-medium)',
                        color: transaction.amount > 0 ? 'hsl(var(--primary))' : 'inherit'
                      }}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount.toFixed(2)} CHF
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.status === 'completed' ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary caption">
                        Abgeschlossen
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="caption">
                        Ausstehend
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="caption text-muted-foreground">
          Zeige 1-8 von 245 Transaktionen
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
