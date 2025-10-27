export function PublicNavbarSkeleton() {
  return (
    <div className="flex h-14 w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-8 w-24 rounded bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-8 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
