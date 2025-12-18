"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { orpcTanstack } from "@/lib/orpc";
import { BusinessList } from "../public/business-list";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";

export function FeaturedBusinesses() {
  const { data: featuredBusinesses } = useSuspenseQuery(
    orpcTanstack.business.featuredBusinesses.queryOptions(),
  );

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Comercios Destacados</h2>
          <p className="text-muted-foreground">
            Los mejores negocios de tu comunidad
          </p>
        </div>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/explorar/comercios">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <BusinessList featuredBusinesses={featuredBusinesses} />
    </section>
  );
}

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
