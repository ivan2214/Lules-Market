import { Card, CardHeader } from "@/shared/components/ui/card";

export function FeaturedBusinessesSkeletons() {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video w-full animate-pulse bg-gray-200" />
            <CardHeader>
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
