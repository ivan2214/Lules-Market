import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-16">
      {/* Hero */}
      <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
        <Skeleton className="mx-auto h-10 w-3/4" />
        <Skeleton className="mx-auto h-5 w-full" />
        <Skeleton className="mx-auto h-5 w-5/6" />
      </div>

      {/* Plan cards */}
      <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>

            <CardContent className="space-y-6">
              <Skeleton className="h-10 w-32" />

              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mx-auto mb-8 h-8 w-64" />

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4">
                      <Skeleton className="h-4 w-32" />
                    </th>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <th key={i} className="p-4">
                        <Skeleton className="mx-auto h-4 w-24" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, row) => (
                    <tr key={row} className="border-b">
                      <td className="p-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      {Array.from({ length: 3 }).map((_, col) => (
                        <td key={col} className="p-4">
                          <Skeleton className="mx-auto h-4 w-20" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-16 max-w-3xl">
        <Skeleton className="mx-auto mb-8 h-8 w-72" />

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="space-y-6 py-12">
            <Skeleton className="mx-auto h-8 w-2/3" />
            <Skeleton className="mx-auto h-5 w-5/6" />
            <Skeleton className="mx-auto h-12 w-64 rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
