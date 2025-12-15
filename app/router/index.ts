import { createLog } from "./admin";
import { featuredBusinesses, listAllBusinesses } from "./business";
import { listAllProducts, recentProducts } from "./products";
import { getHomePageStats } from "./stats";

export const router = {
  admin: {
    createLog,
  },
  products: {
    recentProducts,
    listAllProducts,
  },
  business: {
    featuredBusinesses,
    listAllBusinesses,
  },
  stats: {
    getHomePageStats,
  },
};
