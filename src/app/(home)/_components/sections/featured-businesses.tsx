import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BusinessList } from "@/app/(home)/_components/business-list";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { BusinessDto } from "@/shared/utils/dto";

export function FeaturedBusinesses({ data }: { data: BusinessDto[] }) {
  const featuredBusinesses = data || [];

  return (
    <section>
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
