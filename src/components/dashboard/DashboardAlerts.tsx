import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Folder, Layers } from 'lucide-react'
import { formatBRL } from '@/lib/format'
import type { AlertItem } from '@/types'

interface DashboardAlertsProps {
  categoryAlerts: AlertItem[]
  stageAlerts: AlertItem[]
}

function AlertCard({
  icon,
  title,
  alerts,
}: {
  icon: React.ReactNode
  title: string
  alerts: AlertItem[]
}) {
  if (alerts.length === 0) return null
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => (
          <Alert
            key={alert.name}
            variant="destructive"
            className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20"
          >
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900 dark:text-amber-200">{alert.name}</AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              <div className="text-xs">Previsto: {formatBRL(alert.planned)}</div>
              <div className="text-xs">Executado: {formatBRL(alert.executed)}</div>
              <div className="text-xs font-semibold">Estouro: {formatBRL(alert.exceeded)}</div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  )
}

export function DashboardAlerts({ categoryAlerts, stageAlerts }: DashboardAlertsProps) {
  const hasAlerts = categoryAlerts.length > 0 || stageAlerts.length > 0
  if (!hasAlerts) return null

  return (
    <div className="space-y-4">
      <AlertCard
        icon={<Folder className="h-4 w-4" />}
        title="Categorias excedidas"
        alerts={categoryAlerts}
      />
      <AlertCard
        icon={<Layers className="h-4 w-4" />}
        title="Etapas excedidas"
        alerts={stageAlerts}
      />
    </div>
  )
}
