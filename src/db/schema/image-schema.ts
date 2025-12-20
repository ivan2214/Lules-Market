import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { business } from "./business-schema";
import { product } from "./product-schema";
import { bannedImages, profile } from "./user-schema";

/**
 * ===============================================================
 * IMAGES
 * ===============================================================
 */

export const image = pgTable(
  "image",
  {
    key: text("key").primaryKey().unique(),
    url: text("url").notNull(),
    isMainImage: boolean("is_main_image").default(false).notNull(),
    name: text("name"),
    size: doublePrecision("size"),
    isReported: boolean("is_reported").default(false).notNull(),
    productId: text("product_id"),
    logoBusinessId: text("logo_business_id").unique(),
    coverBusinessId: text("cover_business_id").unique(),
    avatarId: text("avatar_id").unique(),
    isBanned: boolean("is_banned").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("image_productId_idx").on(table.productId),
    index("image_coverBusinessId_idx").on(table.coverBusinessId),
    index("image_logoBusinessId_idx").on(table.logoBusinessId),
  ],
);

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const imageRelations = relations(image, ({ one }) => ({
  product: one(product, {
    fields: [image.productId],
    references: [product.id],
  }),
  logoBusiness: one(business, {
    fields: [image.logoBusinessId],
    references: [business.id],
    relationName: "logo",
  }),
  coverBusiness: one(business, {
    fields: [image.coverBusinessId],
    references: [business.id],
    relationName: "coverImage",
  }),
  avatar: one(profile, {
    fields: [image.avatarId],
    references: [profile.userId],
  }),
  bannedImages: one(bannedImages, {
    fields: [image.key],
    references: [bannedImages.imageKey],
  }),
}));
