import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import {
  admin,
  business,
  category,
  currentPlan,
  image,
  log,
  plan,
  product,
  user,
} from "../schema";

import { spreads } from "./utils";

const dateSchema = t.Union([t.Date(), t.String(), t.Null()]);

const timestampSchema = {
  createdAt: dateSchema,
  updatedAt: dateSchema,
};

// ============================================
// BASE SCHEMAS (sin relaciones)
// ============================================

const productBase = createSelectSchema(product, timestampSchema);
const categoryBase = createSelectSchema(category, timestampSchema);
const imageBase = createSelectSchema(image, timestampSchema);
const businessBase = createSelectSchema(business, timestampSchema);
const userBase = createSelectSchema(user, timestampSchema);
const adminBase = createSelectSchema(admin, timestampSchema);
const planBase = createSelectSchema(plan, timestampSchema);
const currentPlanBase = createSelectSchema(currentPlan, {
  ...timestampSchema,
  expiresAt: dateSchema,
  activatedAt: dateSchema,
});
const logBase = createSelectSchema(log);

// ============================================
// SCHEMAS CON RELACIONES
// ============================================

// Logo schema (es una imagen)
const logoSchema = t.Object({
  ...imageBase.properties,
});

const coverImageSchema = t.Object({
  ...imageBase.properties,
});

const categorySchema = t.Object({
  ...categoryBase.properties,
});

// CurrentPlan con plan anidado
const currentPlanWithRelationsSchema = t.Object({
  ...currentPlanBase.properties,
  plan: t.Optional(
    t.Object({
      ...planBase.properties,
    }),
  ),
});

// Business con relaciones
const businessWithRelationsSchema = t.Object({
  ...businessBase.properties,
  currentPlan: t.Optional(currentPlanWithRelationsSchema),
  logo: t.Optional(logoSchema),
  coverImage: t.Optional(coverImageSchema),
  category: t.Optional(categorySchema),
  products: t.Optional(
    t.Array(
      t.Object({
        ...productBase.properties,
      }),
    ),
  ),
});

// Product con todas sus relaciones
const productWithRelationsSchema = t.Object({
  ...productBase.properties,
  images: t.Optional(
    t.Array(
      t.Object({
        ...imageBase.properties,
      }),
    ),
  ),
  category: t.Optional(
    t.Object({
      ...categoryBase.properties,
    }),
  ),
  business: t.Optional(businessWithRelationsSchema),
});

// ============================================
// EXPORT MODELS
// ============================================

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
        ...timestampSchema,
      }),
      category: createInsertSchema(category, timestampSchema),
      image: createInsertSchema(image, timestampSchema),
      business: createInsertSchema(business, timestampSchema),
      user: createInsertSchema(user, timestampSchema),
      admin: createInsertSchema(admin),
      plan: createInsertSchema(plan),
      log: createInsertSchema(log),
    },
    "insert",
  ),
  select: spreads(
    {
      product: productBase,
      category: categoryBase,
      image: imageBase,
      business: businessBase,
      user: userBase,
      admin: adminBase,
      plan: planBase,
      currentPlan: currentPlanBase,
      log: logBase,
    },
    "select",
  ),
  // Schemas con relaciones (no usan spreads)
  relations: {
    productWithRelations: productWithRelationsSchema,
    businessWithRelations: businessWithRelationsSchema,
    currentPlanWithRelations: currentPlanWithRelationsSchema,
  },
} as const;
