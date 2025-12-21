import "server-only";
import { os } from "@orpc/server";
import z from "zod";
import { db } from "@/db";
import { businessView } from "@/db/schema";
import type { BusinessWithRelations } from "@/db/types";
import {
  featuredBusinessesCache,
  getAllBusinessIdsCache,
  getBusinessByIdCache,
  ListAllBusinessesInputSchema,
  ListAllBusinessesOutputSchema,
  listAllBusinessesByCategoriesCache,
  listAllBusinessesCache,
} from "../cache-functions/business";

export const featuredBusinesses = os
  .route({
    method: "GET",
    summary: "Obtener negocios destacados",
    description: "Obtener una lista de negocios destacados",
    tags: ["Business"],
  })
  .output(z.array(z.custom<BusinessWithRelations>()))
  .handler(async () => {
    return await featuredBusinessesCache();
  });

export const listAllBusinesses = os
  .route({
    method: "GET",
    summary: "Listar todos los negocios",
    description: "Listar todos los negocios con paginación y filtros",
    tags: ["Business"],
  })
  .input(ListAllBusinessesInputSchema)
  .output(ListAllBusinessesOutputSchema)
  .handler(async ({ input }) => {
    return await listAllBusinessesCache(input);
  });

export const getAllBusinessIds = os
  .route({
    method: "GET",
    summary: "Get all business IDs",
    tags: ["Business"],
  })
  .input(z.object({ limit: z.number().optional() }).optional())
  .output(z.array(z.object({ id: z.string() })))
  .handler(async ({ input }) => {
    return await getAllBusinessIdsCache(input?.limit);
  });

export const getBusinessById = os
  .route({
    method: "GET",
    summary: "Get business by id",
    tags: ["Business"],
  })
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return getBusinessByIdCache(input.id);
  });

export const listAllBusinessesByCategories = os
  .route({
    method: "GET",
    summary: "List all businesses by categories",
    tags: ["Business"],
  })
  .input(z.object({ category: z.string().nullish() }))
  .output(
    z.object({
      businesses: z.array(z.custom<BusinessWithRelations>()).nullish(),
    }),
  )
  .handler(async ({ input }) => {
    if (!input.category) {
      return { businesses: null };
    }
    const businesses = await listAllBusinessesByCategoriesCache({
      category: input.category,
    });
    return businesses;
  });

export const trackBusinessView = os
  .route({
    method: "POST",
    summary: "Track business view",
    tags: ["Business"],
  })
  .input(z.object({ businessId: z.string() }))
  .handler(async ({ input }) => {
    await db.insert(businessView).values({
      businessId: input.businessId,
      referrer: "unknown",
    });
  });

export const businessRoute = {
  featuredBusinesses,
  listAllBusinesses,
  getAllBusinessIds,
  getBusinessById,
  listAllBusinessesByCategories,
  trackBusinessView,
};
