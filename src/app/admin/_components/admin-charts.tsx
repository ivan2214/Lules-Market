"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";

interface AdminChartsProps {
  revenueData: { month: string; revenue: number }[];
  growthData: { month: string; count: number }[];
}

const revenueConfig = {
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const growthConfig = {
  count: {
    label: "Nuevos Comercios",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AdminCharts({ revenueData, growthData }: AdminChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>
            Ingresos aprobados en los últimos 6 meses.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer
            config={revenueConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <BarChart accessibilityLayer data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Crecimiento de Comercios</CardTitle>
          <CardDescription>
            Nuevos comercios registrados por mes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={growthConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <BarChart accessibilityLayer data={growthData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
