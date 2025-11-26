import { Skeleton } from "../ui/skeleton";

export function DashboardSidebarSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Skeleton className="h-full w-64" />
      </div>
    </div>
  );
}
