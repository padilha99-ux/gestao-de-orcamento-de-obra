import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ParsedSpreadsheet, ColumnMappings } from '@/services/budget-import'

interface MappingStepProps {
  parsedData: ParsedSpreadsheet
  mappings: ColumnMappings
  onMappingChange: (field: string, value: string) => void
  onNext: () => void
  onBack: () => void
}

const requiredFields = [
  { key: 'item', label: 'Item / Descrição' },
  { key: 'planned_value', label: 'Valor Planejado' },
  { key: 'planned_date', label: 'Data Planejada' },
  { key: 'responsible', label: 'Responsável' },
] as const

const optionalFields = [
  { key: 'category', label: 'Categoria (opcional)' },
  { key: 'stage', label: 'Etapa (opcional)' },
] as const

export function MappingStep({
  parsedData,
  mappings,
  onMappingChange,
  onNext,
  onBack,
}: MappingStepProps) {
  const allRequiredSet = requiredFields.every((f) => mappings[f.key])

  const renderSelect = (fieldKey: string, label: string) => (
    <div key={fieldKey} className="space-y-1">
      <Label>{label}</Label>
      <Select
        value={mappings[fieldKey as keyof ColumnMappings] || undefined}
        onValueChange={(v) => onMappingChange(fieldKey, v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a coluna" />
        </SelectTrigger>
        <SelectContent>
          {parsedData.headers.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapeamento de Colunas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Associe cada coluna da planilha aos campos correspondentes do orçamento.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {requiredFields.map((f) => renderSelect(f.key, f.label))}
          {optionalFields.map((f) => renderSelect(f.key, f.label))}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button disabled={!allRequiredSet} onClick={onNext}>
            Revisar Itens
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
