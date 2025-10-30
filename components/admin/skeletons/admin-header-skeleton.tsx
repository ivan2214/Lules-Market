import { Skeleton } from "@/components/ui/skeleton";

export function AdminHeaderSkeleton() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-foreground text-lg">
          Panel de Administración
        </h2>
      </div>

      <Skeleton className="h-8 w-8 rounded" />
    </header>
  );
}
