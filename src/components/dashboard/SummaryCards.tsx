import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { DashboardSummary } from '@/types'

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    {
      title: 'Previsto',
      value: formatCurrency(summary.planned),
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Executado',
      value: formatCurrency(summary.executed),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Diferença',
      value: formatCurrency(summary.difference),
      icon: summary.difference >= 0 ? TrendingUp : TrendingDown,
      color: summary.difference >= 0 ? 'text-green-600' : 'text-red-600',
      bg: summary.difference >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: '% Executado',
      value: `${summary.executedPercent.toFixed(1)}%`,
      icon: Percent,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
