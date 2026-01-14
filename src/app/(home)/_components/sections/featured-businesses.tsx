"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BusinessList } from "@/app/(home)/_components/business-list";
import { api } from "@/lib/eden";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export function FeaturedBusinesses() {
  const { data } = useSuspenseQuery({
    queryKey: ["featured-businesses"],
    queryFn: async () => {
      const { data, error } = await api.business.public.featured.get();
      if (error) throw error;
      return data;
    },
  });

  const featuredBusinesses = data || [];

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
