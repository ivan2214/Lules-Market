import type { MetadataRoute } from "next";
import { env } from "@/env/server";
import { BusinessService } from "@/server/modules/business/service";
import { ProductService } from "@/server/modules/products/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.APP_URL;

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/explorar/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explorar/comercios`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/que-es`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/para-clientes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/para-comercios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/planes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/como-funciona`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    // Obtener datos en paralelo con manejo de errores
    const [productsResult, businessesResult] = await Promise.allSettled([
      ProductService.listAllProductsForSitemap(true),
      BusinessService.listAllBusinessesForSitemap(true),
    ]);

    const productPages: MetadataRoute.Sitemap =
      productsResult.status === "fulfilled" && productsResult.value
        ? productsResult.value.map((product) => ({
            url: `${baseUrl}/producto/${product.id}`,
            lastModified: product.updatedAt ?? new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }))
        : [];

    const businessPages: MetadataRoute.Sitemap =
      businessesResult.status === "fulfilled" && businessesResult.value
        ? businessesResult.value.map((business) => ({
            url: `${baseUrl}/comercio/${business.id}`,
            lastModified: business.updatedAt ?? new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }))
        : [];

    return [...staticPages, ...productPages, ...businessPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // En caso de error crítico, retornar al menos las páginas estáticas
    return staticPages;
  }
}
