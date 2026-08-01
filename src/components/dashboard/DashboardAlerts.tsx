import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { AlertItem } from '@/types'

export function DashboardAlerts({
  categoryAlerts,
  stageAlerts,
}: {
  categoryAlerts: AlertItem[]
  stageAlerts: AlertItem[]
}) {
  const hasAlerts = categoryAlerts.length > 0 || stageAlerts.length > 0

  const renderAlertList = (title: string, alerts: AlertItem[]) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      {alerts.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          Tudo dentro do previsto
        </div>
      ) : (
        alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">{alert.name}</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-muted-foreground">Prev: {formatCurrency(alert.planned)}</span>
              {' · '}
              <span className="font-medium text-destructive">
                Exec: {formatCurrency(alert.executed)}
              </span>
              {' · '}
              <span className="text-destructive">+{formatCurrency(alert.exceeded)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alertas de Estouro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAlerts ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Nenhum estouro de orçamento detectado.
          </div>
        ) : (
          <>
            {renderAlertList('Por Categoria', categoryAlerts)}
            {renderAlertList('Por Etapa', stageAlerts)}
          </>
        )}
      </CardContent>
    </Card>
  )
}
