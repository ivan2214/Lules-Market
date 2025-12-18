"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/shared/components/ui/chart";
import type { Analytics } from "@/types";

interface BusinessGrowthChartProps {
  data: Analytics["businessGrowth"];
}

const chartConfig = {
  count: {
    label: "Negocios",
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function BusinessGrowthChart({ data }: BusinessGrowthChartProps) {
  // icono y color del footer según tendencia
  const TrendIcon =
    data.trend === "up"
      ? TrendingUp
      : data.trend === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    data.trend === "up"
      ? "text-green-500"
      : data.trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crecimiento de Negocios</CardTitle>
        <CardDescription>Nuevos negocios registrados por mes</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data.data}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={70}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className={`flex gap-2 font-medium leading-none ${trendColor}`}>
          {data.trend === "stable"
            ? "Crecimiento estable este mes"
            : data.trend === "up"
              ? `Crecimiento del ${data.percentage.toFixed(1)}% este mes`
              : `Disminución del ${data.percentage.toFixed(1)}% este mes`}{" "}
          <TrendIcon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando el total de negocios de los últimos meses
        </div>
      </CardFooter>
    </Card>
  );
}
