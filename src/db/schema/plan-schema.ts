import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { currentPlan } from "./current-plan-schema";
import { listPriorityEnum, planTypeEnum } from "./enums";

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
  details: json("details")
    .$type<{ products: string; images: string; priority: string }>()
    .notNull(),
  popular: boolean("popular").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  listPriority: listPriorityEnum("list_priority").default("Estandar").notNull(),
});

export const planRelations = relations(plan, ({ many }) => ({
  currentPlans: many(currentPlan),
}));
