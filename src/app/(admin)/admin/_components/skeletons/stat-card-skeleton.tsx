import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface StatCardSkeletonProps {
  title?: string;
  value?: string | number;
  showIconSkeleton?: boolean;
  showTrendSkeleton?: boolean;
  icon?: LucideIcon;
}

export function StatCardSkeleton({
  title,
  value,

  showIconSkeleton = false,
  showTrendSkeleton = false,
  icon: Icon,
}: StatCardSkeletonProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        {title ? (
          <CardTitle className="font-medium text-muted-foreground text-sm">
            {title}
          </CardTitle>
        ) : (
          <Skeleton className="h-4 w-24" />
        )}

        {Icon ? (
          <Icon className="h-4 w-4 text-muted-foreground" />
        ) : (
          showIconSkeleton && <Skeleton className="h-4 w-4 rounded-full" />
        )}
      </CardHeader>

      <CardContent>
        {value ? (
          <div className="font-bold text-2xl">{value}</div>
        ) : (
          <Skeleton className="h-8 w-20" />
        )}

        {showTrendSkeleton && <Skeleton className="mt-3 h-3 w-24" />}
      </CardContent>
    </Card>
  );
}
