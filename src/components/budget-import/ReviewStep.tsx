import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { formatCurrency, parseNumber } from '@/lib/import-utils'
import type { ColumnMapping } from '@/services/budget-import'

interface ReviewStepProps {
  rows: Record<string, string>[]
  mapping: ColumnMapping
  onBack: () => void
  onConfirm: () => void
  isLoading: boolean
  error: string | null
}

const PREVIEW_ROWS = 10

export function ReviewStep({
  rows,
  mapping,
  onBack,
  onConfirm,
  isLoading,
  error,
}: ReviewStepProps) {
  const previewRows = rows.slice(0, PREVIEW_ROWS)
  const totalValue = rows.reduce((sum, row) => {
    const val = mapping.planned_value ? parseNumber(row[mapping.planned_value]) : 0
    return sum + val
  }, 0)

  const getVal = (row: Record<string, string>, key: keyof ColumnMapping) =>
    mapping[key] ? row[mapping[key]!] || '-' : '-'

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Revisar Dados</CardTitle>
        <CardDescription>
          {rows.length} itens serao importados. Valor total: {formatCurrency(totalValue)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsavel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{getVal(row, 'item')}</TableCell>
                  <TableCell>{getVal(row, 'stage')}</TableCell>
                  <TableCell className="text-right">
                    {mapping.planned_value
                      ? formatCurrency(parseNumber(row[mapping.planned_value]))
                      : '-'}
                  </TableCell>
                  <TableCell>{getVal(row, 'category')}</TableCell>
                  <TableCell>{getVal(row, 'planned_date')}</TableCell>
                  <TableCell>{getVal(row, 'responsible')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {rows.length > PREVIEW_ROWS && (
          <p className="text-xs text-muted-foreground text-center">
            Exibindo as primeiras {PREVIEW_ROWS} linhas de {rows.length} total.
          </p>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmar Importacao
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
