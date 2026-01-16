import { type Static, t } from "elysia";
import { models } from "@/db/model";

export namespace AnalyticsModel {
  export const AnalyticsPeriodSchema = t.UnionEnum(["7d", "30d", "90d"]);
  export type AnalyticsPeriod = Static<typeof AnalyticsPeriodSchema>;

  export const homePageStatsOutput = t.Object({
    activeBusinessesTotal: t.Number(),
    activeBusinessesLastMonth: t.Number(),
    productsTotal: t.Number(),
    productsLastMonth: t.Number(),
  });

  export const statsQuery = t.Optional(
    t.Object({ period: AnalyticsPeriodSchema }),
  );

  export const statsOutput = t.Object({
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
  });

  export const productStatsOutput = t.Object({
    product: t.Object(models.select.product),
    totalViews: t.Number(),
    dailyViews: t.Array(t.Object({ date: t.String(), views: t.Number() })),
  });
  export type HomePageStatsOutput = Static<typeof homePageStatsOutput>;
  export type StatsOutput = Static<typeof statsOutput>;
  export type ProductStatsOutput = Static<typeof productStatsOutput>;
}
