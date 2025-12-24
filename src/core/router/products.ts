import "server-only";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { product, productView } from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";
import {
  getSimilarProductsCache,
  ListAllProductsInputSchema,
  listAllProductsCache,
  recentProductsCache,
} from "../cache-functions/products";
import { base } from "./middlewares/base";

export const recentProducts = base
  .route({
    path: "/products/recent",
    method: "GET",
    summary: "Obtener productos recientes",
    description: "Obtener una lista de productos recientes",
    tags: ["Products"],
  })
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async () => {
    return await recentProductsCache();
  });

export const listAllProducts = base
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

export const getProductById = base
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

export const trackProductView = base
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

export const getSimilarProducts = base
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

export const productsRoute = {
  recentProducts,
  listAllProducts,
  getProductById,
  trackProductView,
  getSimilarProducts,
};
