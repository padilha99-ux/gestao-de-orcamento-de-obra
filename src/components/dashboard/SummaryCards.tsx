import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatBRL, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DashboardSummary } from '@/types'
import { Wallet, Receipt, TrendingDown, TrendingUp, PieChart } from 'lucide-react'

interface SummaryCardsProps {
  summary: DashboardSummary
}

interface CardConfig {
  label: string
  value: string
  icon: React.ReactNode
  isOverrun?: boolean
  progress?: number
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isOverrun = summary.difference < 0

  const cards: CardConfig[] = [
    {
      label: 'Total Previsto',
      value: formatBRL(summary.planned),
      icon: <Wallet className="h-5 w-5 text-blue-500" />,
    },
    {
      label: 'Total Executado',
      value: formatBRL(summary.executed),
      icon: <Receipt className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Diferença',
      value: formatBRL(summary.difference),
      icon: isOverrun ? (
        <TrendingDown className="h-5 w-5 text-red-500" />
      ) : (
        <TrendingUp className="h-5 w-5 text-green-500" />
      ),
      isOverrun,
    },
    {
      label: 'Variação (%)',
      value: formatPercent(summary.variation),
      icon: (
        <TrendingUp
          className={cn('h-5 w-5', summary.variation > 0 ? 'text-red-500' : 'text-green-500')}
        />
      ),
      isOverrun: summary.variation > 0,
    },
    {
      label: '% Executado',
      value: formatPercent(summary.executedPercent),
      icon: <PieChart className="h-5 w-5 text-purple-500" />,
      progress: Math.min(summary.executedPercent, 100),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={cn(
            'transition-colors duration-200',
            card.isOverrun && 'border-destructive/50 bg-destructive/5',
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', card.isOverrun && 'text-destructive')}>
              {card.value}
            </div>
            {card.progress !== undefined && <Progress value={card.progress} className="mt-2 h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
