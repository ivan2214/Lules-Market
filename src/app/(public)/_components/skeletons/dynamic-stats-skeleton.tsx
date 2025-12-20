import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

export function DynamicStatsSkeletons() {
  return (
    <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
