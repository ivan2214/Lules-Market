import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { business } from "./business-schema";
import { planTypeEnum } from "./enums";

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
export const trialRelations = relations(trial, ({ one }) => ({
  business: one(business, {
    fields: [trial.businessId],
    references: [business.id],
  }),
}));
