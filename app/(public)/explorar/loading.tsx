import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Search Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Pills Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`pill-${i}`} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`card-${i}`} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
