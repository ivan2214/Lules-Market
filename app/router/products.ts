import { os } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, type ProductWithRelations } from "@/db";
import { product } from "@/db/schema";

export const recentProducts = os
  .route({
    path: "/products/recent",
    method: "GET",
    summary: "Obtener productos recientes",
    description: "Obtener una lista de productos recientes",
    tags: ["Products"],
  })
  .input(z.void())
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async () => {
    const products = await db.query.product.findMany({
      where: and(eq(product.active, true), eq(product.isBanned, false)),
      with: {
        images: true,
        business: true,
        category: true,
      },
      orderBy: [desc(product.createdAt)],
      limit: 8,
    });
    return products;
  });
