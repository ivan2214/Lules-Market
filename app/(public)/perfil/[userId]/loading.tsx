import { Card, CardContent } from "@/app/shared/components/ui/card";
import { Skeleton } from "@/app/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header Skeleton */}
      <Card className="mb-8 overflow-hidden p-0">
        <div className="h-32 bg-muted/20" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
            <div className="-mt-12 relative">
              <Skeleton className="h-24 w-24 rounded-full border-4 border-background sm:h-32 sm:w-32" />
            </div>

            <div className="mt-4 flex-1 space-y-3 text-center sm:mt-0 sm:pb-2 sm:text-left">
              <Skeleton className="mx-auto h-8 w-48 sm:mx-0" />
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
