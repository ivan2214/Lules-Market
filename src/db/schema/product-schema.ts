import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { business } from "./business-schema";
import { category } from "./category-schema";
import { image } from "./image-schema";
import { bannedProduct } from "./user-schema";

/**
 * ===============================================================
 * PRODUCTS & VIEWS
 * ===============================================================
 */

export const product = pgTable(
  "product",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    price: doublePrecision("price"),
    featured: boolean("featured").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    stock: integer("stock").default(0),
    brand: text("brand"),
    businessId: text("business_id").notNull(),
    isBanned: boolean("is_banned").default(false),
    categoryId: text("category_id"),
    tags: text("tags").array(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("product_businessId_idx").on(table.businessId),
    index("product_featured_idx").on(table.featured),
    index("product_active_idx").on(table.active),
    index("product_categoryId_idx").on(table.categoryId),
  ],
);

export const productView = pgTable(
  "product_view",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text("product_id").notNull(),
    referrer: text("referrer"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("product_view_productId_idx").on(table.productId)],
);

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const productRelations = relations(product, ({ one, many }) => ({
  business: one(business, {
    fields: [product.businessId],
    references: [business.id],
  }),
  bannedProduct: one(bannedProduct, {
    fields: [product.id],
    references: [bannedProduct.productId],
  }),
  images: many(image),
  productViews: many(productView),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
}));

export const productViewRelations = relations(productView, ({ one }) => ({
  product: one(product, {
    fields: [productView.productId],
    references: [product.id],
  }),
}));
