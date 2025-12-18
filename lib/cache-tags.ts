/**
 * Cache tag utilities for Next.js cache revalidation
 * Use these constants to ensure consistent cache tagging across the application
 */

// Business-related cache tags
export const CACHE_TAGS = {
  ADMIN: {
    DASHBOARD: {
      STATS: "admin-dashboard-stats",
      ANALYTICS: "admin-dashboard-analytics",
    },
    ADMINS: {
      GET_ALL: "admin-admins-get-all",
      GET_BY_ID: (id: string) => `admin-admins-get-by-id-${id}`,
    },
    BUSINESS: {
      GET_ALL: "admin-business-get-all",
      GET_BY_ID: (id: string) => `admin-business-get-by-id-${id}`,
    },
    LOGS: {
      GET_ALL: "admin-logs-get-all",
      GET_BY_ID: (id: string) => `admin-logs-get-by-id-${id}`,
      CREATE_LOG: "admin-logs-create-log",
    },
    MEDIA: {
      GET_ALL: "admin-media-get-all",
      GET_BY_ID: (id: string) => `admin-media-get-by-id-${id}`,
    },
    PAYMENTS: {
      GET_ALL: "admin-payments-get-all",
      GET_BY_ID: (id: string) => `admin-payments-get-by-id-${id}`,
    },
    PLANS: {
      GET_ALL: "admin-plans-get-all",
      GET_BY_ID: (id: string) => `admin-plans-get-by-id-${id}`,
      CREATE_PLAN: "admin-plans-create-plan",
    },
    PRODUCTS: {
      GET_ALL: "admin-products-get-all",
      GET_BY_ID: (id: string) => `admin-products-get-by-id-${id}`,
      CREATE_PRODUCT: "admin-products-create-product",
    },
    TRIALS: {
      GET_ALL: "admin-trials-get-all",
      GET_BY_ID: (id: string) => `admin-trials-get-by-id-${id}`,
      CREATE_TRIAL: "admin-trials-create-trial",
    },
    ANALYTICS: {
      GET_ALL: "admin-analytics-get-all",
    },
  },

  BUSINESS: {
    GET_ALL: "businesses",
    GET_BY_ID: (id: string) => `business-${id}`,
    GET_PRODUCTS: (businessId: string) => `business-${businessId}-products`,
    ANALYTICS: {
      GET_ALL: "business-analytics-get-all",
      GET_BY_ID: (id: string) => `business-analytics-get-by-id-${id}`,
    },
    PROFILE: (businessId: string) => `business-profile-get-by-id-${businessId}`,
    PRODUCTS: "business-products",
  },

  PRODUCT: {
    GET_ALL: "products",
    GET_BY_ID: (id: string) => `product-${id}`,
  },

  CATEGORY: {
    GET_ALL: "categories",
  },

  ANALYTICS: {
    HOME_PAGE_STATS: "analytics-home-page-stats",
    GET_STATS: "analytics-get-stats",
    GET_PRODUCT_STATS: (productId: string) =>
      `analytics-get-product-stats-${productId}`,
  },

  PLAN: {
    GET_ALL: "plan-get-all",
    GET_BY_ID: (id: string) => `plan-get-by-id-${id}`,
  },

  DEV_TOOLS: {
    GET_ALL: "dev-tools",
  },
} as const;
