"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Analytics } from "@/types/admin";

interface PlanDistributionChartProps {
  data: Analytics["planDistribution"];
}

const COLORS = {
  FREE: "hsl(var(--chart-1))",
  BASIC: "hsl(var(--chart-2))",
  PREMIUM: "hsl(var(--chart-3))",
};

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
  const chartData = [
    { name: "FREE", value: data.FREE },
    { name: "BASIC", value: data.BASIC },
    { name: "PREMIUM", value: data.PREMIUM },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Planes</CardTitle>
        <CardDescription>Negocios por tipo de plan</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
