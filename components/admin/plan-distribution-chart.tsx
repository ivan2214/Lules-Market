"use client";

import { Cell, LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Analytics } from "@/types";

interface PlanDistributionChartProps {
  data: Analytics["planDistribution"];
}

// Configuración de colores y etiquetas
const chartConfig = {
  FREE: {
    label: "Free",
    color: "var(--chart-3)",
  },
  BASIC: {
    label: "Basic",
    color: "var(--chart-2)",
  },
  PREMIUM: {
    label: "Premium",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
  // 🔥 Adaptar a la estructura real que llega desde el backend
  const chartData = [
    { name: "FREE", value: data.FREE.value },
    { name: "BASIC", value: data.BASIC.value },
    { name: "PREMIUM", value: data.PREMIUM.value },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribución de Planes</CardTitle>
        <CardDescription>Negocios por tipo de plan</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              stroke="hsl(var(--background))"
            >
              {/* Aplica color diferente a cada sector */}
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    chartConfig[entry.name as keyof typeof chartConfig].color
                  }
                />
              ))}

              {/* Etiqueta interna */}
              <LabelList
                angle={-50}
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
