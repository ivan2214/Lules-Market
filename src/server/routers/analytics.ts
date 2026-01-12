import { Elysia, type Static, t } from "elysia";
import {
  getHomePageStatsCache,
  getProductStatsCache,
  getStatsCache,
} from "@/core/cache-functions/analytics";
import type { Product } from "@/db/types";
import { AppError } from "../errors";
import { authPlugin } from "../plugins/auth";

export const analyticsPublicRouter = new Elysia({
  prefix: "/analytics/public",
}).get(
  "/home-page-stats",
  async () => {
    try {
      const stats = await getHomePageStatsCache();
      return { success: true, stats };
    } catch (error) {
      console.error(
        "Error al obtener estadísticas de la página de inicio:",
        error,
      );
      throw new AppError(
        "Error al obtener estadísticas de la página de inicio",
        "INTERNAL_SERVER_ERROR",
      );
    }
  },
  {
    response: {
      stats: t.Object({
        activeBusinessesTotal: t.Number(),
        activeBusinessesLastMonth: t.Number(),
        productsTotal: t.Number(),
        productsLastMonth: t.Number(),
      }),
      success: t.Boolean(),
    },
  },
);

export const AnalyticsPeriodSchema = t.UnionEnum(["7d", "30d", "90d"]);

export type AnalyticsPeriod = Static<typeof AnalyticsPeriodSchema>;

export const analyticsPrivateRouter = new Elysia({
  prefix: "/analytics/private",
})
  .use(authPlugin)
  .get(
    "/stats",
    async ({ currentBusiness, query }) => {
      try {
        const stats = await getStatsCache(currentBusiness.id, query.period);
        return stats;
      } catch (error) {
        console.error(
          "Error al obtener estadísticas de la página de inicio:",
          error,
        );
        throw new AppError(
          "Error al obtener estadísticas de la página de inicio",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      isBusiness: true,
      currentBusiness: true,
      response: t.Object({
        totalViews: t.Number(),
        productViews: t.Number(),
        businessViews: t.Number(),
        dailyViews: t.Array(t.Object({ date: t.String(), views: t.Number() })),
        topProducts: t.Array(
          t.Object({ id: t.String(), name: t.String(), count: t.Number() }),
        ),
        topReferrers: t.Array(
          t.Object({ referrer: t.String(), count: t.Number() }),
        ),
      }),
      query: t.Optional(t.Object({ period: AnalyticsPeriodSchema })),
    },
  )
  .get(
    "/product-stats/:productId",
    async ({ currentBusiness, query, params }) => {
      try {
        const stats = await getProductStatsCache({
          businessId: currentBusiness.id,
          period: query.period,
          productId: params.productId,
        });
        return stats;
      } catch (error) {
        console.error(
          "Error al obtener estadísticas de la página de inicio:",
          error,
        );
        throw new AppError(
          "Error al obtener estadísticas de la página de inicio",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      isBusiness: true,
      currentBusiness: true,
      response: t.Object({
        product: t.Unsafe<Product>(t.Any()),
        totalViews: t.Number(),
        dailyViews: t.Array(t.Object({ date: t.String(), views: t.Number() })),
      }),
      query: t.Optional(t.Object({ period: AnalyticsPeriodSchema })),
    },
  );
