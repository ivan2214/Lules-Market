import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.url(),

    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_ENDPOINT_URL: z.url(),
    S3_BUCKET_NAME: z.string(),
    S3_BUCKET_URL: z.string(),

    CRON_SECRET: z.string(),

    MP_WEBHOOK_SECRET: z.string(),
    MP_ACCESS_TOKEN: z.string(),

    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),

    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
    ADMIN_NAME: z.string(),

    EMAIL_FROM: z.string(),
    EMAIL_USER: z.string(),
    EMAIL_PASS: z.string(),

    DATABASE_URL: z.string(),

    SUPER_ADMIN_EMAIL: z.string(),
    SUPER_ADMIN_PASSWORD: z.string(),
    SUPER_ADMIN_NAME: z.string(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    // Redis (Upstash) - optional for local development
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
