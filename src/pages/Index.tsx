import { Loader2, AlertCircle, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { DashboardLists } from '@/components/dashboard/DashboardLists'
import { DashboardAlerts } from '@/components/dashboard/DashboardAlerts'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'

const Index = () => {
  const data = useDashboardData()

  if (data.loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-semibold text-destructive">{data.error}</p>
        <Button onClick={data.retry}>Tentar novamente</Button>
      </div>
    )
  }

  if (data.isEmpty) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-semibold">Nenhum registro encontrado</p>
          <p className="text-sm text-muted-foreground">
            Cadastre notas fiscais e itens de orçamento para visualizar o dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe previsto vs. executado do seu orçamento de obra
        </p>
      </div>

      <DashboardFilters
        filters={data.filters}
        onFiltersChange={data.setFilters}
        categories={data.categories}
        stages={data.stages}
      />

      <SummaryCards summary={data.summary} />

      <DashboardCharts
        categoryData={data.categoryChartData}
        stageData={data.stageChartData}
        evolutionData={data.evolutionChartData}
      />

      {(data.categoryAlerts.length > 0 || data.stageAlerts.length > 0) && (
        <DashboardAlerts categoryAlerts={data.categoryAlerts} stageAlerts={data.stageAlerts} />
      )}

      <DashboardLists recentInvoices={data.recentInvoices} pendingInvoices={data.pendingInvoices} />
    </div>
  )
}

export default Index
