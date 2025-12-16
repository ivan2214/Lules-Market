import { createLog, createPlan, deleteAllLogs } from "./admin";
import { getHomePageStats, getProductStats, getStats } from "./analytics";
import {
  featuredBusinesses,
  getBusinessById,
  listAllBusinesses,
  listAllBusinessesByCategories,
} from "./business";
import {
  businessSetup,
  deleteBusiness,
  getMyBusinessProducts,
  updateBusiness,
} from "./business.private";
import { listAllCategories } from "./category";
import {
  cancel,
  createPreference,
  failure,
  getPayment,
  history,
  startTrial,
  success,
  upgrade,
} from "./payment";
import { getProductById, listAllProducts, recentProducts } from "./products";
import {
  createProduct,
  deleteProduct,
  listProductsByBusinessId,
  updateProduct,
} from "./products.private";
import { deleteAccount, updateAccount } from "./settings";

export const router = {
  category: {
    listAllCategories,
  },
  admin: {
    createLog,
    deleteAllLogs,
    plans: {
      createPlan,
    },
  },
  products: {
    // Public
    recentProducts,
    listAllProducts,
    getProductById,
    // Private
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    listProductsByBusinessId,
  },
  business: {
    // Public
    featuredBusinesses,
    listAllBusinesses,
    listAllBusinessesByCategories,
    getBusinessById,
    // Private
    setup: businessSetup,
    update: updateBusiness,
    delete: deleteBusiness,
    myProducts: getMyBusinessProducts,
  },
  analytics: {
    getStats,
    getProductStats,
    getHomePageStats,
  },
  payment: {
    createPreference,
    upgrade,
    cancel,
    history,
    startTrial,
    failure,
    getPayment,
    success,
  },
  settings: {
    updateAccount,
    deleteAccount,
  },
};
