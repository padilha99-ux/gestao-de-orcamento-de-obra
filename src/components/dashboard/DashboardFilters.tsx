import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'
import { hasActiveFilters } from '@/lib/dashboard-utils'
import type { Category, Stage, DashboardFilters as FiltersType } from '@/types'

export function DashboardFilters({
  filters,
  setFilters,
  categories,
  stages,
}: {
  filters: FiltersType
  setFilters: (f: FiltersType) => void
  categories: Category[]
  stages: Stage[]
}) {
  const clear = () => setFilters({ startDate: '', endDate: '', categoryId: '', stageId: '' })

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filtros
      </div>
      <div className="space-y-1">
        <Label htmlFor="startDate" className="text-xs">
          Data Início
        </Label>
        <Input
          id="startDate"
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="w-auto"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="endDate" className="text-xs">
          Data Fim
        </Label>
        <Input
          id="endDate"
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="w-auto"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Categoria</Label>
        <Select
          value={filters.categoryId || undefined}
          onValueChange={(v) => setFilters({ ...filters, categoryId: v })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas" />
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
        <Label className="text-xs">Etapa</Label>
        <Select
          value={filters.stageId || undefined}
          onValueChange={(v) => setFilters({ ...filters, stageId: v })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas" />
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
      {hasActiveFilters(filters) && (
        <Button variant="outline" size="sm" onClick={clear}>
          <X className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      )}
    </div>
  )
}
