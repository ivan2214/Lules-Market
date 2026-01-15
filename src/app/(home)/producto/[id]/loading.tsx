import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto overflow-hidden">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 py-0 md:py-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Images */}
          <div className="lg:col-span-7">
            <Skeleton className="aspect-square w-full rounded-xl md:aspect-4/3" />
            <div className="mt-4 flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-4 px-8 lg:col-span-5 lg:px-0">
            {/* Category + badge */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* Title + description */}
            <div className="space-y-3">
              <Skeleton className="h-9 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <Separator />

            {/* Price */}
            <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-5">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>

            {/* Business card */}
            <Card className="rounded-xl p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <Skeleton className="mt-4 h-11 w-full rounded-md" />
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Similar products */}
        <div className="flex flex-col gap-4 px-8 lg:px-0">
          <Skeleton className="h-7 w-56" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
