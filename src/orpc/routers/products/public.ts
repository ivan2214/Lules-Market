import "server-only";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import {
  getSimilarProductsCache,
  ListAllProductsInputSchema,
  listAllProductsCache,
  recentProductsCache,
} from "@/core/cache-functions/products";
import { db } from "@/db";
import { product, productView } from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";
import { o } from "@/orpc/context";

export const recentProducts = o
  .route({
    method: "GET",
    summary: "Obtener productos recientes",
    description: "Obtener una lista de productos recientes",
    tags: ["Products"],
  })
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async () => {
    return await recentProductsCache();
  });

export const listAllProducts = o
  .route({
    path: "/products/list",
    method: "GET",
    summary: "Obtener todos los productos",
    description: "Obtener una lista de todos los productos",
    tags: ["Products"],
  })
  .input(ListAllProductsInputSchema)
  .output(
    z.object({
      products: z.array(z.custom<ProductWithRelations>()),
      total: z.number(),
      pages: z.number().optional(),
      currentPage: z.number().optional(),
    }),
  )
  .handler(async ({ input }) => {
    return await listAllProductsCache(input);
  });

export const getProductById = o
  .route({
    path: "/products/:id",
    method: "GET",
    summary: "Obtener un producto por ID",
    description: "Obtener un producto por ID",
    tags: ["Products"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ product: z.custom<ProductWithRelations>().optional() }))
  .handler(async ({ input }) => {
    const { id } = input;
    const productFound = await db.query.product.findFirst({
      where: eq(product.id, id),
      with: {
        business: {
          with: {
            currentPlan: {
              with: {
                plan: true,
              },
            },
            logo: true,
          },
        },
        images: true,
        category: true,
      },
    });
    if (!productFound) {
      return {
        product: undefined,
      };
    }
    return {
      product: productFound,
    };
  });

export const trackProductView = o
  .route({
    path: "/products/:id/view",
    method: "POST",
    summary: "Registrar una vista de producto",
    description: "Registrar una vista de producto",
    tags: ["Products"],
  })
  .input(z.object({ productId: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    try {
      const { productId } = input;
      const currentHeaders = await headers();
      const referrer = currentHeaders.get("referer") || undefined;
      await db.insert(productView).values({
        productId,
        referrer,
      });
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error tracking product view:", error);
      return {
        success: false,
      };
    }
  });

export const getSimilarProducts = o
  .route({
    path: "/products/:id/similar",
    method: "GET",
    summary: "Obtener productos similares",
    description: "Obtener productos similares basados en categoría",
    tags: ["Products"],
  })
  .input(z.object({ id: z.string(), categoryId: z.string() }))
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async ({ input }) => {
    return await getSimilarProductsCache(input.categoryId, input.id);
  });

export const productsPublicRouter = {
  recentProducts,
  listAllProducts,
  getProductById,
  trackProductView,
  getSimilarProducts,
};
