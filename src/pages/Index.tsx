import { useDashboardData } from '@/hooks/use-dashboard-data'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { DashboardLists } from '@/components/dashboard/DashboardLists'
import { DashboardAlerts } from '@/components/dashboard/DashboardAlerts'
import { DashboardFilters as FiltersBar } from '@/components/dashboard/DashboardFilters'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react'

export default function Index() {
  const dashboard = useDashboardData()

  if (dashboard.loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (dashboard.error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{dashboard.error}</p>
        <Button variant="outline" onClick={dashboard.retry}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (dashboard.isEmpty) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-2">
        <p className="text-lg font-medium">Nenhum dado encontrado</p>
        <p className="text-sm text-muted-foreground">
          Comece cadastrando notas fiscais e itens de orçamento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do orçamento da obra</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <FiltersBar
            filters={dashboard.filters}
            setFilters={dashboard.setFilters}
            categories={dashboard.categories}
            stages={dashboard.stages}
          />
        </CardContent>
      </Card>
      <SummaryCards summary={dashboard.summary} />
      <DashboardCharts
        categoryChartData={dashboard.categoryChartData}
        stageChartData={dashboard.stageChartData}
        evolutionChartData={dashboard.evolutionChartData}
      />
      <DashboardLists
        recentInvoices={dashboard.recentInvoices}
        pendingInvoices={dashboard.pendingInvoices}
      />
      <DashboardAlerts
        categoryAlerts={dashboard.categoryAlerts}
        stageAlerts={dashboard.stageAlerts}
      />
    </div>
  )
}
