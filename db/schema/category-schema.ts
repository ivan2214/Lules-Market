import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { business } from "./business-schema";
import { product } from "./product-schema";

/**
 * ===============================================================
 * CATEGORIES
 * ===============================================================
 */

export const category = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  value: text("value").notNull().unique(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
  businesses: many(business),
}));
