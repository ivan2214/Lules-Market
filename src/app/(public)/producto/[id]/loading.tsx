import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
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
          <div className="space-y-6 lg:col-span-5">
            <div>
              <div className="mb-4 flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>

              <Skeleton className="mb-3 h-9 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-11/12" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2 rounded-lg bg-muted/50 p-5">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Business card */}
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Similar products */}
        <div className="mt-16">
          <Skeleton className="mb-8 h-7 w-64" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
