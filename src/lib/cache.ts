import "server-only";
import type { PlanType } from "@/db/types";
import { isRedisConfigured, redis } from "./redis";

const DEFAULT_TTL = 300; // 5 minutos

/**
 * Obtener valor de caché por key
 * Returns null si no existe o hay error (graceful degradation)
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!isRedisConfigured || !redis) {
    return null;
  }

  try {
    const value = await redis.get<T>(key);
    if (value !== null) {
      console.log(`[CACHE HIT] ${key}`);
    }
    return value;
  } catch (error) {
    console.error(`[CACHE ERROR] Failed to get key: ${key}`, error);
    return null;
  }
}

/**
 * Guardar valor en caché con TTL configurable
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl = DEFAULT_TTL,
): Promise<void> {
  if (!isRedisConfigured || !redis) {
    return;
  }

  try {
    await redis.set(key, value, { ex: ttl });
    console.log(`[CACHE SET] ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    console.error(`[CACHE ERROR] Failed to set key: ${key}`, error);
  }
}

/**
 * Invalidar caché usando SCAN (seguro para producción)
 * SCAN es non-blocking a diferencia de KEYS
 */
export async function invalidateCache(pattern: string): Promise<void> {
  if (!isRedisConfigured || !redis) {
    return;
  }

  try {
    const keysToDelete: string[] = [];
    let cursor = "0";

    // Usar SCAN para no bloquear Redis
    do {
      const result = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = String(result[0]);
      keysToDelete.push(...result[1]);
    } while (cursor !== "0");

    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
      console.log(
        `[CACHE INVALIDATE] Deleted ${keysToDelete.length} keys matching: ${pattern}`,
      );
    }
  } catch (error) {
    console.error(
      `[CACHE ERROR] Failed to invalidate pattern: ${pattern}`,
      error,
    );
  }
}

/**
 * Invalidar múltiples keys específicas
 */
export async function invalidateCacheKeys(...keys: string[]): Promise<void> {
  if (!isRedisConfigured || !redis || keys.length === 0) {
    return;
  }

  try {
    await redis.del(...keys);
    console.log(`[CACHE INVALIDATE] Deleted keys: ${keys.join(", ")}`);
  } catch (error) {
    console.error(
      `[CACHE ERROR] Failed to delete keys: ${keys.join(", ")}`,
      error,
    );
  }
}

/**
 * Helper para obtener de caché o ejecutar función y cachear el resultado
 * Patrón Cache-Aside simplificado
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = DEFAULT_TTL,
): Promise<T> {
  // Intentar obtener de caché
  const cached = await getFromCache<T>(key);

  if (cached !== null) {
    return cached;
  }

  // Cache miss - obtener datos frescos
  console.log(`[CACHE MISS] ${key} - Fetching fresh data`);
  const fresh = await fetchFn();

  // Guardar en caché (no esperar a que termine)
  void setCache(key, fresh, ttl);

  return fresh;
}

/**
 * Generar key de caché a partir de un objeto
 * Útil para consultas con múltiples parámetros
 */
export function generateCacheKey(
  prefix: string,
  params: Record<string, unknown>,
): string {
  const sortedParams = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${String(v)}`)
    .join(":");

  return sortedParams ? `${prefix}:${sortedParams}` : prefix;
}

// TTLs constants para consistencia (en segundos)
const MINUTE = 60;
const HOUR = 60 * 60;

export const CACHE_TTL = {
  PRODUCTS_LIST: 5 * MINUTE,
  PRODUCTS_RECENT: 5 * MINUTE,
  PRODUCTS_SIMILAR: 10 * MINUTE,
  PRODUCT_BY_ID: 10 * MINUTE,
  BUSINESSES_LIST: 5 * MINUTE,
  BUSINESSES_FEATURED: 10 * MINUTE,
  BUSINESS_BY_ID: 15 * MINUTE,
  BUSINESSES_SIMILAR: 10 * MINUTE,
  CATEGORIES: 30 * MINUTE,
  PLANS: 24 * HOUR,
  HOMEPAGE_STATS: 10 * MINUTE,
} as const;

// Cache Keys - evitar strings mágicos
export const CACHE_KEYS = {
  // Patterns para invalidación con SCAN
  PATTERNS: {
    ALL_PRODUCTS: "products:*",
    ALL_BUSINESSES: "businesses:*",
    ALL_CATEGORIES: "categories:*",
  },

  // Keys estáticas
  PRODUCTS_RECENT: "products:recent",
  BUSINESSES_FEATURED: "businesses:featured",
  CATEGORIES_ALL: "categories:all",
  PLANS_ALL: "plans:all",
  HOMEPAGE_STATS: "analytics:homepage-stats",

  // Generadores de keys dinámicas
  product: (id: string) => `product:${id}`,
  plan: (type: PlanType) => `plan:${type}`,
  business: (id: string) => `business:${id}`,
  businessesSimilar: (category: string, businessId: string, limit: string) =>
    `businesses:similar:${category}:${businessId}:${limit}`,
  productsSimilar: (categoryId: string, productId: string) =>
    `products:similar:${categoryId}:${productId}`,
  productsByBusiness: (businessId: string) =>
    `products:by-business:${businessId}`,
  businessMyProducts: (
    businessId: string,
    limit: number | string,
    offset: number | string,
  ) => `business:${businessId}:my-products:${limit}:${offset}`,
} as const;
