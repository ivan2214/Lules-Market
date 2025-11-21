import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.url(),

    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    AWS_ENDPOINT_URL_S3: z.url(),
    AWS_ENDPOINT_URL_IAM: z.url(),

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
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  client: {},
  experimental__runtimeEnv: process.env,
});
