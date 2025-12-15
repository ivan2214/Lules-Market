import { createLog } from "./admin";
import {
  featuredBusinesses,
  getBusinessById,
  listAllBusinesses,
  listAllBusinessesByCategories,
} from "./business";
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
    listAllBusinessesByCategories,
    getBusinessById,
  },
  stats: {
    getHomePageStats,
  },
};
