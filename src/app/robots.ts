import type { MetadataRoute } from "next";
import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.APP_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/signin",
        "/signup",
        "/verify",
        "/forgot-password",
        "/reset-password",
        "/api/",
        "/dashboard/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
