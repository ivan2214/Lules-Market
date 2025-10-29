import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium text-muted-foreground text-sm">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "font-medium text-xs",
              trend.isPositive ? "text-green-600" : "text-red-600",
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% desde el mes pasado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
