import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}
