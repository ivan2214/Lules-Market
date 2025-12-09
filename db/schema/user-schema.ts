import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { business } from "./business-schema";
import { permissionEnum } from "./enums";
import { image } from "./image-schema";
import { product } from "./product-schema";
/**
 * ===============================================================
 * USER EXTENDED MODELS
 * ===============================================================
 */

export const emailVerificationToken = pgTable(
  "email_verification_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().unique(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("email_verification_token_userId_idx").on(table.userId)],
);

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("password_reset_token_userId_idx").on(table.userId)],
);

export const profile = pgTable("profile", {
  userId: text("user_id").notNull().unique().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const admin = pgTable("admin", {
  userId: text("user_id").notNull().unique().primaryKey(),
  permissions: permissionEnum("permissions").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * ===============================================================
 * BANNED MODELS
 * ===============================================================
 */

export const bannedBusiness = pgTable(
  "banned_business",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    bannedById: text("banned_by_id").notNull(),
    businessId: text("business_id").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("banned_business_bannedById_idx").on(table.bannedById)],
);

export const bannedProduct = pgTable(
  "banned_product",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    bannedById: text("banned_by_id").notNull(),
    productId: text("product_id").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("banned_product_bannedById_idx").on(table.bannedById)],
);

export const bannedImages = pgTable(
  "banned_images",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    bannedById: text("banned_by_id").notNull(),
    imageKey: text("image_key").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("banned_images_bannedById_idx").on(table.bannedById)],
);

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const emailVerificationTokenRelations = relations(
  emailVerificationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [emailVerificationToken.userId],
      references: [user.id],
    }),
  }),
);

export const passwordResetTokenRelations = relations(
  passwordResetToken,
  ({ one }) => ({
    user: one(user, {
      fields: [passwordResetToken.userId],
      references: [user.id],
    }),
  }),
);

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
  avatar: one(image, {
    fields: [profile.userId],
    references: [image.avatarId],
  }),
}));

export const adminRelations = relations(admin, ({ one, many }) => ({
  user: one(user, {
    fields: [admin.userId],
    references: [user.id],
  }),
  bannedBusinesses: many(bannedBusiness),
  bannedProducts: many(bannedProduct),
  bannedImages: many(bannedImages),
}));

export const bannedBusinessRelations = relations(bannedBusiness, ({ one }) => ({
  bannedBy: one(admin, {
    fields: [bannedBusiness.bannedById],
    references: [admin.userId],
  }),
  business: one(business, {
    fields: [bannedBusiness.businessId],
    references: [business.id],
  }),
}));

export const bannedProductRelations = relations(bannedProduct, ({ one }) => ({
  bannedBy: one(admin, {
    fields: [bannedProduct.bannedById],
    references: [admin.userId],
  }),
  product: one(product, {
    fields: [bannedProduct.productId],
    references: [product.id],
  }),
}));

export const bannedImagesRelations = relations(bannedImages, ({ one }) => ({
  bannedBy: one(admin, {
    fields: [bannedImages.bannedById],
    references: [admin.userId],
  }),
  image: one(image, {
    fields: [bannedImages.imageKey],
    references: [image.key],
  }),
}));
