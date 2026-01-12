import { treaty } from "@elysiajs/eden";
import { env } from "@/env/client";
import type { App } from "@/server";

// .api to enter /api prefix
export const api =
  // process is defined on server side and build time
  typeof process !== "undefined"
    ? treaty<App>(env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").api
    : treaty<App>(env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").api;
