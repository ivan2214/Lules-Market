"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Analytics } from "@/types";

interface RevenueChartProps {
  data: Analytics["monthlyRevenue"];
}

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
        <CardDescription>
          Evolución de ingresos en los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full max-h-80 w-full">
          <LineChart accessibilityLayer data={data.data}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="line" nameKey="revenue" />
              }
            />

            <YAxis
              allowDecimals={false}
              tickFormatter={(value) =>
                new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  notation: "compact",
                }).format(value)
              }
            />

            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{ fill: "var(--color-revenue)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="month"
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {data.trend === "up" && (
            <TrendingUp className="h-4 w-4 text-green-500" />
          )}
          {data.trend === "down" && (
            <TrendingDown className="h-4 w-4 rotate-180 text-red-500" />
          )}
          {data.trend === "up" && "Tendencia al alza "}
          {data.trend === "down" && "Tendencia a la baja "}
          {data.trend === "stable" && "Tendencia estable "}
          del {data.percentage.toFixed(0)}%
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando los ingresos totales de los últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
