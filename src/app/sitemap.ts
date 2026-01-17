import type { MetadataRoute } from "next";
import { env } from "@/env/server";
import { BusinessService } from "@/server/modules/business/service";
import { ProductService } from "@/server/modules/products/service";

// Configuración para generar múltiples sitemaps
export async function generateSitemaps() {
  return [{ id: "static" }, { id: "products" }, { id: "businesses" }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.APP_URL;

  // Sitemap de páginas estáticas
  if (id === "static") {
    return [
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
  }

  // Sitemap de productos
  if (id === "products") {
    try {
      const products = await ProductService.listAllProductsForSitemap();

      if (!products || products.length === 0) {
        return [];
      }

      return products.map((product) => ({
        url: `${baseUrl}/producto/${product.id}`,
        lastModified: product.updatedAt ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error("Error generating products sitemap:", error);
      return [];
    }
  }

  // Sitemap de comercios
  if (id === "businesses") {
    try {
      const businesses = await BusinessService.listAllBusinessesForSitemap();

      if (!businesses || businesses.length === 0) {
        return [];
      }

      return businesses.map((business) => ({
        url: `${baseUrl}/comercio/${business.id}`,
        lastModified: business.updatedAt ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error("Error generating businesses sitemap:", error);
      return [];
    }
  }

  // Fallback
  return [];
}
