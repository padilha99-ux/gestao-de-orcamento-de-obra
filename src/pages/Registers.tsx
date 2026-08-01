import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categories'
import { getStages, createStage, updateStage, deleteStage } from '@/services/stages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Loader2, Lock } from 'lucide-react'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import type { Category, Stage } from '@/types'

export default function Registers() {
  const { canEdit } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'category' | 'stage'>('category')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    type: 'category' | 'stage'
  } | null>(null)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [cats, sts] = await Promise.all([getCategories(), getStages()])
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
  useRealtime('categories', () => loadData())
  useRealtime('stages', () => loadData())

  const openCreate = (type: 'category' | 'stage') => {
    setDialogType(type)
    setEditingId(null)
    setName('')
    setDialogOpen(true)
    setError('')
  }
  const openEdit = (type: 'category' | 'stage', id: string, currentName: string) => {
    setDialogType(type)
    setEditingId(id)
    setName(currentName)
    setDialogOpen(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (dialogType === 'category') {
        if (editingId) await updateCategory(editingId, name)
        else await createCategory(name)
      } else {
        if (editingId) await updateStage(editingId, name)
        else await createStage(name)
      }
      setDialogOpen(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      if (deleteTarget.type === 'category') await deleteCategory(deleteTarget.id)
      else await deleteStage(deleteTarget.id)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleteTarget(null)
    }
  }

  if (loading)
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  const renderTable = (
    type: 'category' | 'stage',
    data: { id: string; name: string }[],
    title: string,
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {canEdit && (
          <Button size="sm" onClick={() => openCreate(type)}>
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              {canEdit && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(type, item.id, item.name)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget({ id: item.id, type })}
                    >
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
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Cadastros</h1>
        <p className="text-sm text-muted-foreground">
          {canEdit ? 'Gerencie categorias e etapas' : 'Visualize categorias e etapas'}
        </p>
        {!canEdit && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" /> Acesso somente leitura
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderTable('category', categories, 'Categorias')}
        {renderTable('stage', stages, 'Etapas')}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar' : 'Novo'} {dialogType === 'category' ? 'Categoria' : 'Etapa'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir {deleteTarget?.type === 'category' ? 'Categoria' : 'Etapa'}?
            </AlertDialogTitle>
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
