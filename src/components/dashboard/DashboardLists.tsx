import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatBRL, formatDate } from '@/lib/format'
import type { Invoice } from '@/types'

interface DashboardListsProps {
  recentInvoices: Invoice[]
  pendingInvoices: Invoice[]
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status === 'Pago' ? 'default' : 'secondary'}>{status}</Badge>
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

export function DashboardLists({ recentInvoices, pendingInvoices }: DashboardListsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <EmptyMessage message="Nenhuma nota fiscal encontrada" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.number}</TableCell>
                      <TableCell className="max-w-[120px] truncate">{inv.supplier}</TableCell>
                      <TableCell className="text-right">{formatBRL(inv.amount)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(inv.issue_date)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={inv.payment_status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <EmptyMessage message="Nenhum pagamento pendente" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Etapa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.supplier}</TableCell>
                      <TableCell className="text-right">{formatBRL(inv.amount)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(inv.issue_date)}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {inv.expand?.category?.name || '—'}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {inv.expand?.stage?.name || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
