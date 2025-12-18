"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container px-4 py-4 md:py-8">
      {/* Hero image */}
      <div className="mb-6 md:mb-8">
        <div className="mx-auto max-w-5xl">
          <div className="aspect-4/3 overflow-hidden rounded-xl md:aspect-video md:rounded-2xl">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:mb-8 md:gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Business header */}
          <Card>
            <CardHeader className="flex items-center justify-between gap-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3">
              <Skeleton className="h-5 w-48" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </CardFooter>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full overflow-hidden rounded-md border"
                >
                  <Skeleton className="h-48 w-full" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column – contact */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
