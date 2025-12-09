import { and, desc, eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/db";
import { business } from "@/db/schema";
import { PublicBusinessCard } from "../public/public-business-card";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";

export async function FeaturedBusinesses() {
  // ✅ Mark as dynamic
  await connection();

  /* const featuredBusinesses = await prisma.business.findMany({
    where: { isActive: true, isBanned: false },
    include: {
      category: true,
      logo: true,
    },

    take: 6,
  }); */
  const featuredBusinesses = await db.query.business.findMany({
    where: and(eq(business.isActive, true), eq(business.isBanned, false)),
    limit: 6,
    orderBy: desc(business.createdAt),
    with: {
      category: true,
      logo: true,
    },
  });

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredBusinesses.map((business) => (
          <PublicBusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}

export function BusinessesSkeletons() {
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
