import { desc, eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { headers } from "next/headers";
import {
  featuredBusinessesCache,
  getBusinessByIdCache,
  ListAllBusinessesInputSchema,
  listAllBusinessesCache,
  listAllSimilarBusinessesCache,
} from "@/core/cache-functions/business";
import { db } from "@/db";
import {
  businessView as businessViewSchema,
  product as productSchema,
} from "@/db/schema";
import type { Business, BusinessWithRelations } from "@/db/types";
import { BusinessSetupSchema } from "@/shared/validators/business";
import { authPlugin } from "../plugins/auth";
import { setupBusiness } from "../services/business";

export const businessPublicRouter = new Elysia({
  prefix: "/business/public",
})
  .get("/featured", async () => {
    return await featuredBusinessesCache();
  })
  .get(
    "/list-all",
    async ({ body }) => {
      return await listAllBusinessesCache(body);
    },
    {
      body: ListAllBusinessesInputSchema,
    },
  )
  .get(
    "/get-business-by-id",
    async ({ query }) => {
      return await getBusinessByIdCache(query.id);
    },
    {
      query: t.Object({
        id: t.String(),
      }),
    },
  )
  .get(
    "/list-similar",
    async ({ query }) => {
      const result = await listAllSimilarBusinessesCache(query);

      return result;
    },
    {
      query: t.Object({
        category: t.String(),
        businessId: t.String(),
      }),
      response: t.Object({
        businesses: t.Array(t.Unsafe<BusinessWithRelations>(t.Any())),
      }),
    },
  )
  .post(
    "/trackView/:businessId",
    async ({ params }) => {
      try {
        const { businessId } = params;
        const currentHeaders = await headers();
        const referrer = currentHeaders.get("referer") || undefined;
        await db.insert(businessViewSchema).values({
          businessId,
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
    },
    {
      params: t.Object({
        businessId: t.String(),
      }),
      response: t.Object({
        success: t.Boolean(),
      }),
    },
  )
  .post(
    "/setup",
    async ({ body }) => {
      return await setupBusiness(body);
    },
    {
      body: BusinessSetupSchema,
      response: t.Object({
        success: t.Boolean(),
        business: t.Unsafe<Business>(),
      }),
    },
  );

export const businessPrivateRouter = new Elysia({
  prefix: "/business/private",
})
  .use(authPlugin)
  .get(
    "/my-products",
    async ({ query, currentBusiness }) => {
      const products = await db.query.product.findMany({
        where: eq(productSchema.businessId, currentBusiness.id),
        limit: query.limit,
        offset: query.offset,
        orderBy: [desc(productSchema.createdAt)],
        with: {
          images: true,
        },
      });

      return products;
    },
    {
      currentBusiness: true,
      isBusiness: true,
      query: t.Object({
        limit: t.Number(),
        offset: t.Number(),
      }),
    },
  );
