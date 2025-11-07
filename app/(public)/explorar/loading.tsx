"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      {/* Skeleton Sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r bg-muted/30 p-4 md:flex">
        <div className="mt-16 space-y-6">
          {/* Search */}
          <Skeleton className="h-9 w-full" />

          {/* Categorías */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i.toString()} className="h-5 w-full" />
              ))}
            </div>
          </div>

          {/* Negocios */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i.toString()} className="h-5 w-5/6" />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="mx-auto w-full px-4 py-5">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-9 w-40" />
        </div>

        {/* Active filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i.toString()} className="h-6 w-20 rounded-full" />
          ))}
        </div>

        {/* Product grid */}
        <div className="grid place-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i.toString()} />
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i.toString()} className="h-9 w-20 rounded-md" />
          ))}
        </div>
      </section>
    </main>
  );
}

/* Product card skeleton */
function ProductCardSkeleton() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow lg:w-56">
      <div className="relative aspect-square h-2/3 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="space-y-2 px-4 py-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="mt-3 h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
