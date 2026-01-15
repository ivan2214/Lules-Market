import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container px-4 py-4 md:py-8">
      {/* Cover + logo */}
      <div className="mb-8 md:mb-12">
        <div className="mx-auto max-w-6xl">
          <div className="relative w-full">
            <div className="aspect-video overflow-hidden rounded-2xl shadow-xl md:aspect-21/9">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="absolute bottom-0 left-6 translate-y-1/2 md:left-8">
              <Skeleton className="h-24 w-24 rounded-2xl md:h-32 md:w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 md:gap-8 lg:col-span-2">
          {/* Business info */}
          <Card className="shadow-md">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-3 border-t pt-6">
              <Skeleton className="h-4 w-40" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24 rounded-full" />
                ))}
              </div>
            </CardFooter>
          </Card>

          {/* Products */}
          <Card className="shadow-md">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>

            <CardContent className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border bg-card"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="flex flex-col gap-3 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
          <Card className="shadow-md">
            <CardHeader>
              <Skeleton className="h-6 w-56" />
            </CardHeader>

            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex-col gap-3 border-t pt-6">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
