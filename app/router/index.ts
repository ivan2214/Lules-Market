import { createLog } from "./admin";
import { featuredBusinesses } from "./business";
import { recentProducts } from "./products";

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
};
