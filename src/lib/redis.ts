import "server-only";
import { Redis } from "@upstash/redis";
import { env } from "@/env/server";

/**
 * Cliente de Redis usando Upstash
 * Compatible con Vercel Edge Functions y Serverless
 */

const isRedisConfigured = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);

if (!isRedisConfigured) {
  console.warn(
    "⚠️ Redis credentials not found. Caching will be disabled. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env",
  );
}

export const redis = isRedisConfigured
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export { isRedisConfigured };
