import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Invoice } from '@/types'

export function DashboardLists({
  recentInvoices,
  pendingInvoices,
}: {
  recentInvoices: Invoice[]
  pendingInvoices: Invoice[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notas Fiscais Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma nota fiscal encontrada.</p>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {inv.number} - {inv.supplier}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inv.expand?.category?.name || '-'} · {formatDate(inv.issue_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(inv.amount)}</p>
                    <Badge
                      variant={inv.payment_status === 'Pago' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {inv.payment_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pagamentos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pagamento pendente.</p>
          ) : (
            <div className="space-y-3">
              {pendingInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {inv.number} - {inv.supplier}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inv.expand?.stage?.name || '-'} · {formatDate(inv.issue_date)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-destructive">
                    {formatCurrency(inv.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
