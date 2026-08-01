import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts'
import { formatBRL } from '@/lib/format'

interface DashboardChartsProps {
  categoryData: { name: string; value: number }[]
  stageData: { name: string; value: number }[]
  evolutionData: { month: string; value: number }[]
}

const chartConfig = {
  value: { label: 'Valor', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

export function DashboardCharts({ categoryData, stageData, evolutionData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <EmptyChart message="Sem dados para exibir" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={categoryData} margin={{ left: 0, right: 0, top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatBRL(Number(value))} />}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gastos por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          {stageData.length === 0 ? (
            <EmptyChart message="Sem dados para exibir" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={stageData} margin={{ left: 0, right: 0, top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatBRL(Number(value))} />}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolução dos Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          {evolutionData.length === 0 ? (
            <EmptyChart message="Sem dados para exibir" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={evolutionData} margin={{ left: 0, right: 10, top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatBRL(Number(value))} />}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
