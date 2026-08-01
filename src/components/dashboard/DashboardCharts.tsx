import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const chartConfig = {
  value: { label: 'Valor', color: 'hsl(var(--primary))' },
} satisfies ChartConfig

export function DashboardCharts({
  categoryChartData,
  stageChartData,
  evolutionChartData,
}: {
  categoryChartData: { name: string; value: number }[]
  stageChartData: { name: string; value: number }[]
  evolutionChartData: { month: string; value: number }[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={categoryChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={stageChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Evolução de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={evolutionChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
