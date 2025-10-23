import { z } from "zod";

export const AnalyticsPeriodSchema = z.enum(["7d", "30d", "90d"]).default("30d");
export type AnalyticsPeriod = z.infer<typeof AnalyticsPeriodSchema>;

export type DailyView = {
  date: string;
  views: number;
};

export type TopProduct = {
  id: string;
  name: string;
  count: number;
};

export type TopReferrer = {
  referrer: string;
  count: number;
};

export type AnalyticsDTO = {
  totalViews: number;
  productViews: number;
  businessViews: number;
  dailyViews: DailyView[];
  topProducts: TopProduct[];
  topReferrers: TopReferrer[];
};
