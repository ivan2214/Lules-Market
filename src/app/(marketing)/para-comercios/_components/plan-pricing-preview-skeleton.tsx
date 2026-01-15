import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const PlanPricingPreviewSkeleton = () => {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="relative">
          <CardContent className="flex h-full flex-col justify-between space-y-6 p-6">
            {/* Header */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {[1, 2, 3, 4].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </li>
              ))}
            </ul>

            {/* Button */}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
