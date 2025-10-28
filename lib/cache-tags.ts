/**
 * Cache tag utilities for Next.js cache revalidation
 * Use these constants to ensure consistent cache tagging across the application
 */

// Business-related cache tags
export const CACHE_TAGS = {
  // Business tags
  BUSINESSES: "businesses",
  PUBLIC_BUSINESSES: "public-businesses",
  businessById: (id: string) => `business-${id}`,

  // Product tags
  PRODUCTS: "products",
  PUBLIC_PRODUCTS: "public-products",
  productById: (id: string) => `product-${id}`,
  productsByBusiness: (businessId: string) => `business-${businessId}-products`,

  // Category tags
  CATEGORIES: "categories",

  // Analytics tags
  ANALYTICS: "analytics",
  analyticsById: (id: string) => `analytics-${id}`,
} as const;
