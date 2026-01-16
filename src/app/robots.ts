import type { MetadataRoute } from "next";
import { env } from "@/env/server";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.APP_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/auth/signin",
          "/auth/signup",
          "/auth/two-factor",
          "/auth/verify",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
