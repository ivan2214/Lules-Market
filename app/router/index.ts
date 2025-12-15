import { createLog } from "./admin";
import { featuredBusinesses } from "./business";
import { recentProducts } from "./products";
import { getHomePageStats } from "./stats";

export const router = {
  admin: {
    createLog,
  },
  products: {
    recentProducts,
  },
  business: {
    featuredBusinesses,
  },
  stats: {
    getHomePageStats,
  },
};
