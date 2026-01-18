import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { AdminService } from "@/server/modules/admin/service";

export async function getAdminProducts(options: {
  page: number;
  perPage: number;
  active?: boolean;
  businessId?: string;
}) {
  "use cache";
  cacheTag("admin", "products");
  cacheLife("minutes");

  const [products, total] = await Promise.all([
    AdminService.getPaginatedProducts(options),
    AdminService.getProductsCount({
      active: options.active,
      businessId: options.businessId,
    }),
  ]);

  return { products, total };
}

export async function getAdminProductsStats() {
  "use cache";
  cacheTag("admin", "products-stats");
  cacheLife("hours");

  const [active, inactive, total] = await Promise.all([
    AdminService.getProductsCount({ active: true }),
    AdminService.getProductsCount({ active: false }),
    AdminService.getProductsCount(),
  ]);

  return {
    active,
    inactive,
    total,
  };
}
