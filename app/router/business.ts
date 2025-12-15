import { os } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { type BusinessWithRelations, db } from "@/db";
import { business } from "@/db/schema";

export const featuredBusinesses = os
  .route({
    method: "GET",
    summary: "Obtener negocios destacados",
    description: "Obtener una lista de negocios destacados",
    tags: ["Business"],
  })
  .input(z.void())
  .output(z.array(z.custom<BusinessWithRelations>()))
  .handler(async () => {
    const featuredBusinesses = await db.query.business.findMany({
      where: and(eq(business.isActive, true), eq(business.isBanned, false)),
      limit: 6,
      orderBy: desc(business.createdAt),
      with: {
        category: true,
        logo: true,
      },
    });
    return featuredBusinesses;
  });
