import { Skeleton } from "../ui/skeleton";

export function DashboardHeaderSkeleton() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-0.5">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}
