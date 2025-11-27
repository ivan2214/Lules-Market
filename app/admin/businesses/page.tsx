import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";
import { BusinessesClient } from "./components/businesses-client";

export default async function BusinessesPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("business-page");
  const businesses = await prisma.business.findMany({
    include: {
      bannedBusiness: true,
      coverImage: true,
      logo: true,
      products: {
        include: {
          images: true,
        },
      },
      user: {
        include: {
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
