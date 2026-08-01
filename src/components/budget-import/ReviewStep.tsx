import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertTriangle, Copy, Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReviewRow } from '@/services/budget-import'
import type { Category, Stage } from '@/types'

interface ReviewStepProps {
  rows: ReviewRow[]
  categories: Category[]
  stages: Stage[]
  onUpdate: (index: number, field: string, value: string) => void
  onSkipToggle: (index: number) => void
  onSave: () => void
  onBack: () => void
  saving: boolean
}

export function ReviewStep({
  rows,
  categories,
  stages,
  onUpdate,
  onSkipToggle,
  onSave,
  onBack,
  saving,
}: ReviewStepProps) {
  const validCount = rows.filter(
    (r) => !r.skipped && Object.keys(r.errors).length === 0 && !r.isDuplicate,
  ).length
  const flaggedCount = rows.filter(
    (r) => (!r.categoryMatched || !r.stageMatched) && !r.skipped,
  ).length
  const duplicateCount = rows.filter((r) => r.isDuplicate && !r.skipped).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{rows.length} itens</Badge>
        <Badge>{validCount} válidos</Badge>
        {flaggedCount > 0 && <Badge variant="destructive">{flaggedCount} incompletos</Badge>}
        {duplicateCount > 0 && <Badge variant="outline">{duplicateCount} duplicados</Badge>}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Revisão dos Itens</CardTitle>
          <Button onClick={onSave} disabled={saving || validCount === 0}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Importar {validCount} Itens
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 border-b bg-muted/50">
                <tr>
                  <th className="p-2 text-center"></th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-right">Valor</th>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Resp.</th>
                  <th className="p-2 text-left">Categoria</th>
                  <th className="p-2 text-left">Etapa</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      'border-b',
                      row.skipped && 'opacity-40',
                      row.isDuplicate && !row.skipped && 'bg-amber-50 dark:bg-amber-950/20',
                    )}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.skipped}
                        onChange={() => onSkipToggle(i)}
                        className="h-4 w-4"
                      />
                      {row.isDuplicate && !row.skipped && (
                        <Copy className="mx-auto mt-1 h-3 w-3 text-amber-500" />
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={row.item}
                        onChange={(e) => onUpdate(i, 'item', e.target.value)}
                        className="h-8 w-40"
                      />
                      {row.errors.item && (
                        <p className="text-xs text-destructive">{row.errors.item}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={row.planned_value}
                        onChange={(e) => onUpdate(i, 'planned_value', e.target.value)}
                        className="h-8 w-24 text-right"
                        type="number"
                        step="0.01"
                      />
                      {row.errors.planned_value && (
                        <p className="text-xs text-destructive">{row.errors.planned_value}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={row.planned_date}
                        onChange={(e) => onUpdate(i, 'planned_date', e.target.value)}
                        className="h-8 w-36"
                        type="date"
                      />
                      {row.errors.planned_date && (
                        <p className="text-xs text-destructive">{row.errors.planned_date}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={row.responsible}
                        onChange={(e) => onUpdate(i, 'responsible', e.target.value)}
                        className="h-8 w-28"
                      />
                      {row.errors.responsible && (
                        <p className="text-xs text-destructive">{row.errors.responsible}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Select
                        value={row.category || undefined}
                        onValueChange={(v) => onUpdate(i, 'category', v)}
                      >
                        <SelectTrigger className="h-8 w-32">
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
                      {!row.categoryMatched && !row.category && (
                        <p className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="h-3 w-3" /> Sem correspondência
                        </p>
                      )}
                      {row.errors.category && (
                        <p className="text-xs text-destructive">{row.errors.category}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Select
                        value={row.stage || undefined}
                        onValueChange={(v) => onUpdate(i, 'stage', v)}
                      >
                        <SelectTrigger className="h-8 w-32">
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
                      {!row.stageMatched && !row.stage && (
                        <p className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="h-3 w-3" /> Sem correspondência
                        </p>
                      )}
                      {row.errors.stage && (
                        <p className="text-xs text-destructive">{row.errors.stage}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onSave} disabled={saving || validCount === 0}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Importar {validCount} Itens
        </Button>
      </div>
    </div>
  )
}
