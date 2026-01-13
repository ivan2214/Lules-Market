import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import {
  admin,
  business,
  category,
  image,
  log,
  plan,
  product,
  user,
} from "../schema";
import { spreads } from "./utils";

export const models = {
  insert: spreads(
    {
      product: createInsertSchema(product, {
        name: t.String({ minLength: 1, error: "Name is required" }),
        description: t.Optional(
          t.String({ minLength: 1, error: "Description is required" }),
        ),
        price: t.Optional(
          t.Number({ minimum: 0, error: "Price must be positive" }),
        ),
        active: t.Optional(t.Boolean()),
      }),
      category: category,
      image: image,
      business: business,
      user: user,
      admin: admin,
      plan: plan,
      log: log,
    },
    "insert",
  ),
  select: spreads(
    {
      product: createSelectSchema(product),
      category: category,
      image: image,
      business: business,
      user: user,
      admin: admin,
      plan: plan,
      log: log,
    },
    "select",
  ),
} as const;
