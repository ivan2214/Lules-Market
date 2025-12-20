export type AnalyticsData = {
  totalViews: number;
  productViews: number;
  businessViews: number;
  dailyViews: Array<{ date: string; views: number }>;
  topProducts: Array<{ id: string; name: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
};
