import { useState, useEffect, useMemo } from 'react'
import { getInvoices } from '@/services/invoices'
import { getBudgetItems } from '@/services/budget-items'
import { getCategories } from '@/services/categories'
import { getStages } from '@/services/stages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { Invoice, BudgetItem, Category, Stage } from '@/types'

interface ComparisonRow {
  name: string
  planned: number
  executed: number
  difference: number
}

const chartConfig = {
  planned: { label: 'Previsto', color: 'hsl(var(--chart-1))' },
  executed: { label: 'Executado', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function Reports() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getInvoices(), getBudgetItems(), getCategories(), getStages()])
      .then(([inv, bi, cats, sts]) => {
        setInvoices(inv)
        setBudgetItems(bi)
        setCategories(cats)
        setStages(sts)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalPlanned = budgetItems.reduce((s, i) => s + i.planned_value, 0)
  const totalExecuted = invoices.reduce((s, i) => s + i.amount, 0)

  const categoryComparison = useMemo<ComparisonRow[]>(() => {
    return categories
      .map((cat) => {
        const planned = budgetItems
          .filter((bi) => bi.category === cat.id)
          .reduce((s, i) => s + i.planned_value, 0)
        const executed = invoices
          .filter((inv) => inv.category === cat.id)
          .reduce((s, i) => s + i.amount, 0)
        return { name: cat.name, planned, executed, difference: executed - planned }
      })
      .filter((r) => r.planned > 0 || r.executed > 0)
  }, [invoices, budgetItems, categories])

  const stageComparison = useMemo<ComparisonRow[]>(() => {
    return stages
      .map((st) => {
        const planned = budgetItems
          .filter((bi) => bi.stage === st.id)
          .reduce((s, i) => s + i.planned_value, 0)
        const executed = invoices
          .filter((inv) => inv.stage === st.id)
          .reduce((s, i) => s + i.amount, 0)
        return { name: st.name, planned, executed, difference: executed - planned }
      })
      .filter((r) => r.planned > 0 || r.executed > 0)
  }, [invoices, budgetItems, stages])

  if (loading)
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  const renderComparisonTable = (title: string, rows: ComparisonRow[]) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Previsto</TableHead>
              <TableHead className="text-right">Executado</TableHead>
              <TableHead className="text-right">Diferença</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.planned)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.executed)}</TableCell>
                <TableCell
                  className={`text-right font-medium ${row.difference >= 0 ? 'text-destructive' : 'text-green-600'}`}
                >
                  {row.difference >= 0 ? '+' : ''}
                  {formatCurrency(row.difference)}
                </TableCell>
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
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Comparativo entre previsto e executado</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Previsto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPlanned)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Executado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExecuted)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Diferença</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-center gap-2 text-2xl font-bold ${totalExecuted - totalPlanned >= 0 ? 'text-destructive' : 'text-green-600'}`}
            >
              {totalExecuted - totalPlanned >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {formatCurrency(totalExecuted - totalPlanned)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparativo por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={categoryComparison}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="planned" fill="hsl(var(--chart-1))" radius={4} />
              <Bar dataKey="executed" fill="hsl(var(--chart-2))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      {renderComparisonTable('Detalhamento por Categoria', categoryComparison)}
      {renderComparisonTable('Detalhamento por Etapa', stageComparison)}
    </div>
  )
}
