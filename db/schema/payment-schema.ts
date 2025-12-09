import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { business } from "./business-schema";
import { planTypeEnum } from "./enums";

/**
 * ===============================================================
 * PAYMENTS
 * ===============================================================
 */

export const payment = pgTable(
  "payment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    amount: doublePrecision("amount").notNull(),
    currency: text("currency").default("ARS").notNull(),
    status: text("status").notNull(), // pending, approved, rejected
    paymentMethod: text("payment_method"),
    mpPaymentId: text("mp_payment_id").unique(),
    mpStatus: text("mp_status"),
    plan: planTypeEnum("plan").notNull(),
    businessId: text("business_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("payment_businessId_idx").on(table.businessId),
    index("payment_status_idx").on(table.status),
  ],
);

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const paymentRelations = relations(payment, ({ one }) => ({
  business: one(business, {
    fields: [payment.businessId],
    references: [business.id],
  }),
}));
