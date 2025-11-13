import type { Business, FavoriteBusiness, User } from "@/app/generated/prisma";

export interface FavoriteBusinessDTO extends FavoriteBusiness {
  user: User;
  product: Business;
}
