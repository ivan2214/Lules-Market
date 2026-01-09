import type { MetadataRoute } from "next";
import { env } from "@/env/server";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.APP_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/auth/signin",
        "/auth/signup",
        "/auth/verify",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/api/",
        "/dashboard/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
