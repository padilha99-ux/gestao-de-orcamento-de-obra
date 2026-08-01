import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { X, Filter } from 'lucide-react'
import { emptyFilters, hasActiveFilters } from '@/lib/dashboard-utils'
import type { Category, Stage, DashboardFilters } from '@/types'

interface DashboardFiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  categories: Category[]
  stages: Stage[]
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  categories,
  stages,
}: DashboardFiltersProps) {
  const active = hasActiveFilters(filters)

  const update = (key: keyof DashboardFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearAll = () => onFiltersChange(emptyFilters)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
          {active && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="mr-1 h-3 w-3" />
              Limpar todos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="start-date" className="text-xs">
                Data Inicial
              </Label>
              {filters.startDate && (
                <button
                  onClick={() => update('startDate', '')}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              )}
            </div>
            <Input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => update('startDate', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="end-date" className="text-xs">
                Data Final
              </Label>
              {filters.endDate && (
                <button
                  onClick={() => update('endDate', '')}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              )}
            </div>
            <Input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => update('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Categoria</Label>
            <Select value={filters.categoryId} onValueChange={(v) => update('categoryId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Etapa</Label>
            <Select value={filters.stageId} onValueChange={(v) => update('stageId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {stages.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
