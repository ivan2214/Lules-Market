import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductsSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i.toString()} className="h-64 w-full" />
        ))}
      </div>
    </>
  );
}
