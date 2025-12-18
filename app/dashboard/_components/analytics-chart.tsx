"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/shared/components/ui/chart";

interface AnalyticsChartProps {
  data: Array<{ date: string; views: number }>;
}

const chartConfig = {
  views: {
    label: "Visitas",
    color: "var(--chart-2)",
  },
  date: {
    label: "Fecha",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("es-AR", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <LineChart
        accessibilityLayer
        data={formattedData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          dataKey="views"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          /* tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }} */
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="views"
              /*   labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }} */
            />
          }
        />
        <Line
          dataKey="views"
          type="monotone"
          stroke={`var(--chart-1)`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
