import type { Product, ReportedProduct, User } from "@/app/generated/prisma";

export interface ReportedProductDTO extends ReportedProduct {
  user: User;
  product: Product;
}
