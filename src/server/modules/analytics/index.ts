import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { AnalyticsModel } from "./model";
import { AnalyticsService } from "./service";

export const analyticsModule = new Elysia()
  .group("/analytics/public", (app) =>
    app.get(
      "/home-page-stats",
      async () => {
        try {
          const stats = await AnalyticsService.getHomePageStats();
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
        response: AnalyticsModel.homePageStatsOutput,
      },
    ),
  )
  .group("/analytics/private", (app) =>
    app
      .use(authPlugin)
      .get(
        "/stats",
        async ({ query, isBusiness, business }) => {
          if (!isBusiness || !business)
            throw new AppError("Unauthorized", "UNAUTHORIZED");
          try {
            return await AnalyticsService.getStats(business.id, query.period);
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

          response: AnalyticsModel.statsOutput,
          query: AnalyticsModel.statsQuery,
        },
      )
      .get(
        "/product-stats/:productId",
        async ({ query, params, isBusiness, business }) => {
          if (!isBusiness || !business)
            throw new AppError("Unauthorized", "UNAUTHORIZED");
          try {
            return await AnalyticsService.getProductStats({
              businessId: business.id,
              period: query.period,
              productId: params.productId,
            });
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
          response: AnalyticsModel.productStatsOutput,
          query: AnalyticsModel.statsQuery,
        },
      ),
  );
