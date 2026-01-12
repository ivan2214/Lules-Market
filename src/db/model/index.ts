import { admin, business, category, image, product, user } from "../schema";
import { spreads } from "./utils";

export const models = {
  insert: spreads(
    {
      product: product,
      category: category,
      image: image,
      business: business,
      user: user,
      admin: admin,
    },
    "insert",
  ),
  select: spreads(
    {
      product: product,
      category: category,
      image: image,
      business: business,
      user: user,
      admin: admin,
    },
    "select",
  ),
} as const;
