import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { category } from "./category-schema";
import { currentPlan } from "./current-plan-schema";
import { businessStatusEnum } from "./enums";
import { image } from "./image-schema";
import { payment } from "./payment-schema";
import { product } from "./product-schema";

import { trial } from "./trial-schema";

/**
 * ===============================================================
 * BUSINESS & PLANS
 * ===============================================================
 */

export const business = pgTable(
  "business",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    description: text("description"),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    website: text("website"),
    facebook: text("facebook"),
    instagram: text("instagram"),
    address: text("address"),
    verified: boolean("verified").default(false).notNull(),
    status: businessStatusEnum("status")
      .default("PENDING_VERIFICATION")
      .notNull(),
    userId: text("user_id").notNull().unique(),
    tags: text("tags").array(),
    categoryId: text("category_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("business_categoryId_idx").on(table.categoryId),
    // Índice compuesto para negocios activos por categoría (listAllBusinessesCache)
    index("business_isActive_categoryId_idx").on(
      table.isActive,
      table.categoryId,
    ),
    // Índice para negocios activos ordenados por fecha (featuredBusinessesCache)
    index("business_isActive_createdAt_idx").on(
      table.isActive,
      table.createdAt,
    ),
  ],
);

export const businessView = pgTable(
  "business_view",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id").notNull(),
    referrer: text("referrer"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("business_view_businessId_idx").on(table.businessId)],
);

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const businessRelations = relations(business, ({ one, many }) => ({
  user: one(user, {
    fields: [business.userId],
    references: [user.id],
  }),
  currentPlan: one(currentPlan),
  logo: one(image, {
    fields: [business.id],
    references: [image.logoBusinessId],
    relationName: "logo",
  }),
  coverImage: one(image, {
    fields: [business.id],
    references: [image.coverBusinessId],
    relationName: "coverImage",
  }),
  products: many(product),
  payments: many(payment),

  businessViews: many(businessView),
  trial: one(trial),
  category: one(category, {
    fields: [business.categoryId],
    references: [category.id],
  }),
}));

export const businessViewRelations = relations(businessView, ({ one }) => ({
  business: one(business, {
    fields: [businessView.businessId],
    references: [business.id],
  }),
}));
