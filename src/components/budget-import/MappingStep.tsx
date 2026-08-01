import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ColumnMapping } from '@/services/budget-import'

interface MappingStepProps {
  headers: string[]
  mapping: ColumnMapping
  onMappingChange: (mapping: ColumnMapping) => void
  onBack: () => void
  onNext: () => void
}

const FIELDS: { key: keyof ColumnMapping; label: string; required: boolean }[] = [
  { key: 'item', label: 'Item', required: true },
  { key: 'stage', label: 'Etapa', required: true },
  { key: 'planned_value', label: 'Valor Planejado', required: true },
  { key: 'category', label: 'Categoria', required: false },
  { key: 'planned_date', label: 'Data Planejada', required: false },
  { key: 'responsible', label: 'Responsavel', required: false },
]

export function MappingStep({
  headers,
  mapping,
  onMappingChange,
  onBack,
  onNext,
}: MappingStepProps) {
  const handleFieldChange = (key: keyof ColumnMapping, value: string) => {
    onMappingChange({ ...mapping, [key]: value === '__none__' ? undefined : value })
  }

  const canProceed = FIELDS.filter((f) => f.required).every((f) => mapping[f.key])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mapear Colunas</CardTitle>
        <CardDescription>
          Selecione qual coluna do arquivo corresponde a cada campo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {FIELDS.map((field) => (
            <div key={field.key} className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium shrink-0">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <Select
                value={mapping[field.key] || '__none__'}
                onValueChange={(v) => handleFieldChange(field.key, v)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione uma coluna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">-- Nenhum --</SelectItem>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Button disabled={!canProceed} onClick={onNext}>
            Revisar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
