import { Skeleton } from "../ui/skeleton";

export function PublicNavbarSkeleton() {
  return (
    <header className="container sticky top-0 z-50 mx-auto w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-10">
      <div className="flex h-14 w-full items-center justify-between gap-2">
        <div className="w-32">
          <Skeleton className="h-12 w-28" />
        </div>

        <div>
          <Skeleton className="h-8 w-[450px] max-w-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </header>
  );
}
