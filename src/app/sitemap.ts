import type { MetadataRoute } from "next";
import { env } from "@/env/server";
import { api } from "@/lib/eden";
import { BusinessService } from "@/server/modules/business/service";
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

  // Obtener productos dinámicos
  const { data: dataProducts } = await api.products.public.list.get();
  const products = dataProducts?.products;

  const productPages: MetadataRoute.Sitemap =
    products?.map((product) => ({
      url: `${baseUrl}/producto/${product.id}`,
      lastModified: product.updatedAt ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  // Obtener comercios dinámicos
  // Obtener comercios dinámicos
  const { businesses } = await BusinessService.listAll();

  const businessPages: MetadataRoute.Sitemap =
    businesses?.map((business) => ({
      url: `${baseUrl}/comercio/${business.id}`,
      lastModified: business.updatedAt ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [...staticPages, ...productPages, ...businessPages];
}
