import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { category } from "./category-schema";
import { businessStatusEnum, planStatusEnum, planTypeEnum } from "./enums";
import { image } from "./image-schema";
import { payment } from "./payment-schema";
import { product } from "./product-schema";
import { bannedBusiness } from "./user-schema";

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
    email: text("email").notNull().unique(),
    website: text("website"),
    facebook: text("facebook"),
    instagram: text("instagram"),
    address: text("address"),
    verified: boolean("verified").default(false).notNull(),
    status: businessStatusEnum("status")
      .default("PENDING_VERIFICATION")
      .notNull(),
    userId: text("user_id").notNull().unique(),
    isBanned: boolean("is_banned").default(false),
    tags: text("tags").array(),
    categoryId: text("category_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("business_categoryId_idx").on(table.categoryId)],
);

export const currentPlan = pgTable(
  "current_plan",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id").notNull().unique(),
    planType: planTypeEnum("plan_type").notNull(),
    planStatus: planStatusEnum("plan_status").default("INACTIVE").notNull(),
    isTrial: boolean("is_trial").default(false).notNull(),
    productsUsed: integer("products_used").default(0).notNull(),
    imagesUsed: integer("images_used").default(0).notNull(),
    hasStatistics: boolean("has_statistics").default(false).notNull(),
    canFeatureProducts: boolean("can_feature_products")
      .default(false)
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    activatedAt: timestamp("activated_at").notNull(),
    isActive: boolean("is_active").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("current_plan_planType_idx").on(table.planType)],
);

export const plan = pgTable("plan", {
  type: planTypeEnum("type").primaryKey().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  discount: integer("discount").default(0).notNull(),
  features: text("features").array().notNull(),
  maxProducts: integer("max_products").notNull(),
  maxImagesPerProduct: integer("max_images_per_product").notNull(),
  hasStatistics: boolean("has_statistics").default(false).notNull(),
  canFeatureProducts: boolean("can_feature_products").default(false).notNull(),
  details: json("details")
    .$type<{ products: string; images: string; priority: string }>()
    .notNull(),
  popular: boolean("popular").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const trial = pgTable("trial", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  businessId: text("business_id").notNull().unique(),
  plan: planTypeEnum("plan").default("PREMIUM").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  activatedAt: timestamp("activated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

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
  bannedBusiness: one(bannedBusiness, {
    fields: [business.id],
    references: [bannedBusiness.businessId],
  }),
  businessViews: many(businessView),
  trial: one(trial),
  category: one(category, {
    fields: [business.categoryId],
    references: [category.id],
  }),
}));

export const currentPlanRelations = relations(currentPlan, ({ one }) => ({
  business: one(business, {
    fields: [currentPlan.businessId],
    references: [business.id],
  }),
  plan: one(plan, {
    fields: [currentPlan.planType],
    references: [plan.type],
  }),
}));

export const planRelations = relations(plan, ({ many }) => ({
  currentPlans: many(currentPlan),
}));

export const trialRelations = relations(trial, ({ one }) => ({
  business: one(business, {
    fields: [trial.businessId],
    references: [business.id],
  }),
}));

export const businessViewRelations = relations(businessView, ({ one }) => ({
  business: one(business, {
    fields: [businessView.businessId],
    references: [business.id],
  }),
}));
