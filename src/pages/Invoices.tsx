import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/services/invoices'
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
import { Badge } from '@/components/ui/badge'
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
import type { Invoice, Category, Stage } from '@/types'

const emptyForm = {
  number: '',
  supplier: '',
  amount: '',
  issue_date: '',
  category: '',
  stage: '',
  payment_status: 'Pendente',
  description: '',
  observations: '',
}

export default function Invoices() {
  const { canEdit } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
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
      const [inv, cats, sts] = await Promise.all([getInvoices(), getCategories(), getStages()])
      setInvoices(inv)
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
  useRealtime('invoices', () => loadData())

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setDialogOpen(true)
    setError('')
  }
  const openEdit = (inv: Invoice) => {
    setForm({
      number: inv.number,
      supplier: inv.supplier,
      amount: String(inv.amount),
      issue_date: inv.issue_date,
      category: inv.category,
      stage: inv.stage,
      payment_status: inv.payment_status,
      description: inv.description || '',
      observations: inv.observations || '',
    })
    setEditingId(inv.id)
    setDialogOpen(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = { ...form, amount: parseFloat(form.amount) }
      if (editingId) await updateInvoice(editingId, data)
      else await createInvoice(data)
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
      await deleteInvoice(deleteId)
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
          <h1 className="text-2xl font-bold">Notas Fiscais</h1>
          <p className="text-sm text-muted-foreground">Gerencie as notas fiscais da obra</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Nota
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.number}</TableCell>
                  <TableCell>{inv.supplier}</TableCell>
                  <TableCell className="text-right">{formatCurrency(inv.amount)}</TableCell>
                  <TableCell>{formatDate(inv.issue_date)}</TableCell>
                  <TableCell>{inv.expand?.category?.name || '-'}</TableCell>
                  <TableCell>{inv.expand?.stage?.name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={inv.payment_status === 'Pago' ? 'default' : 'secondary'}>
                      {inv.payment_status}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(inv)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(inv.id)}>
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
            <DialogTitle>{editingId ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="issue_date">Data de Emissão</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                  required
                />
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
                <Label>Status</Label>
                <Select
                  value={form.payment_status}
                  onValueChange={(v) => setForm({ ...form, payment_status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label htmlFor="observations">Observações</Label>
                <Input
                  id="observations"
                  value={form.observations}
                  onChange={(e) => setForm({ ...form, observations: e.target.value })}
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
            <AlertDialogTitle>Excluir Nota Fiscal?</AlertDialogTitle>
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
