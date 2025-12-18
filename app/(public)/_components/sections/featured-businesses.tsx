"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import { Card, CardHeader } from "@/app/shared/components/ui/card";
import { orpcTanstack } from "@/lib/orpc";
import { BusinessList } from "../business-list";

export function FeaturedBusinesses() {
  const { data: featuredBusinesses } = useSuspenseQuery(
    orpcTanstack.business.featuredBusinesses.queryOptions(),
  );

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge
            variant="secondary"
            className="inline-block font-medium text-primary text-sm"
          >
            Destacados
          </Badge>
          <h2 className="font-bold text-3xl">Comercios que inspiran</h2>
          <p className="text-muted-foreground">
            Negocios locales comprometidos con la calidad y el servicio.
          </p>
        </div>
        <Button
          variant="outline"
          className="group gap-2 border-primary/20 bg-background hover:border-primary/50"
          asChild
        >
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
