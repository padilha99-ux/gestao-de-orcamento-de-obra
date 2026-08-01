import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from '@/services/budget-items'
import { getCategories } from '@/services/categories'
import { getStages } from '@/services/stages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import type { BudgetItem, Category, Stage } from '@/types'

const emptyForm = {
  item: '',
  stage: '',
  planned_value: '',
  category: '',
  planned_date: '',
  responsible: '',
}

export default function BudgetPlanning() {
  const { canEdit } = useAuth()
  const [items, setItems] = useState<BudgetItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [bi, cats, sts] = await Promise.all([getBudgetItems(), getCategories(), getStages()])
      setItems(bi)
      setCategories(cats)
      setStages(sts)
    } catch {
      setError('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('budget_items', () => loadData())

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setDialogOpen(true)
    setError('')
  }
  const openEdit = (item: BudgetItem) => {
    setForm({
      item: item.item || '',
      stage: item.stage || '',
      planned_value: String(item.planned_value),
      category: item.category,
      planned_date: item.planned_date,
      responsible: item.responsible,
    })
    setEditingId(item.id)
    setDialogOpen(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = { ...form, planned_value: parseFloat(form.planned_value) }
      if (editingId) await updateBudgetItem(editingId, data)
      else await createBudgetItem(data)
      setDialogOpen(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteBudgetItem(deleteId)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleteId(null)
    }
  }

  if (loading)
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planejamento</h1>
          <p className="text-sm text-muted-foreground">Itens de orçamento planejados</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead className="text-right">Valor Planejado</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
                {canEdit && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item || '-'}</TableCell>
                  <TableCell>{item.expand?.stage?.name || '-'}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.planned_value)}</TableCell>
                  <TableCell>{item.expand?.category?.name || '-'}</TableCell>
                  <TableCell>{formatDate(item.planned_date)}</TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Item' : 'Novo Item de Orçamento'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="item">Item</Label>
                <Input
                  id="item"
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Etapa</Label>
                <Select
                  value={form.stage || undefined}
                  onValueChange={(v) => setForm({ ...form, stage: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Categoria</Label>
                <Select
                  value={form.category || undefined}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="planned_value">Valor Planejado (R$)</Label>
                <Input
                  id="planned_value"
                  type="number"
                  step="0.01"
                  value={form.planned_value}
                  onChange={(e) => setForm({ ...form, planned_value: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="planned_date">Data Planejada</Label>
                <Input
                  id="planned_date"
                  type="date"
                  value={form.planned_date}
                  onChange={(e) => setForm({ ...form, planned_date: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={form.responsible}
                  onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Item?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
