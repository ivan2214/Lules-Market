import "server-only";
import { revalidateTag } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { businessView } from "@/db/schema";
import type { BusinessWithRelations } from "@/db/types";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";
import {
  featuredBusinessesCache,
  getBusinessByIdCache,
  ListAllBusinessesInputSchema,
  ListAllBusinessesOutputSchema,
  listAllBusinessesCache,
  listAllSimilarBusinessesCache,
} from "../cache-functions/business";
import { base } from "./middlewares/base";

export const featuredBusinesses = base
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

export const listAllBusinesses = base
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

export const getBusinessById = base
  .route({
    method: "GET",
    summary: "Get business by id",
    tags: ["Business"],
  })
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return getBusinessByIdCache(input.id);
  });

export const listAllSimilarBusinesses = base
  .route({
    method: "GET",
    summary: "List all businesses by categories",
    tags: ["Business"],
  })
  .input(z.object({ category: z.string().nullish(), businessId: z.string() }))
  .output(
    z.object({
      businesses: z.array(z.custom<BusinessWithRelations>()).nullish(),
    }),
  )
  .handler(async ({ input }) => {
    if (!input.category) {
      return { businesses: null };
    }
    const businesses = await listAllSimilarBusinessesCache({
      category: input.category,
      businessId: input.businessId,
    });
    return businesses;
  });

export const trackBusinessView = base
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
    revalidateTag(CACHE_TAGS.ANALYTICS.GET_STATS, "max");
  });

export const businessRoute = {
  featuredBusinesses,
  listAllBusinesses,
  getBusinessById,
  listAllSimilarBusinesses,
  trackBusinessView,
};
