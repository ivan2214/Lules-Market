import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { business } from "./business-schema";
import { listPriorityEnum, planStatusEnum, planTypeEnum } from "./enums";
import { plan } from "./plan-schema";
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

    expiresAt: timestamp("expires_at").notNull(),
    activatedAt: timestamp("activated_at").notNull(),
    isActive: boolean("is_active").default(false).notNull(),
    listPriority: listPriorityEnum("list_priority")
      .default("Estandar")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("current_plan_planType_idx").on(table.planType)],
);
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
