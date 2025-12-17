import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { BusinessesClient } from "./components/businesses-client";

export default async function BusinessesPage() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ADMIN.BUSINESS.GET_ALL);
  const businesses = await db.query.business.findMany({
    with: {
      bannedBusiness: true,
      coverImage: true,
      logo: true,
      products: {
        with: {
          images: true,
        },
      },
      user: {
        with: {
          admin: true,
          business: true,
        },
      },
      currentPlan: true,
    },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Negocios
        </h1>
        <p className="text-muted-foreground">
          Administra todos los comercios de la plataforma
        </p>
      </div>

      <BusinessesClient businesses={businesses} />
    </div>
  );
}
