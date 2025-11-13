import type { FavoriteProduct, Product, User } from "@/app/generated/prisma";

export interface FavoriteProductDTO extends FavoriteProduct {
  user: User;
  product: Product;
}
