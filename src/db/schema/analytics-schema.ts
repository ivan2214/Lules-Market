import {
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * ===============================================================
 * ANALYTICS, LOGS & WEBHOOKS
 * ===============================================================
 */

export const analytics = pgTable("analytics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  date: timestamp("date").notNull().unique(),
  totalTrials: integer("total_trials").default(0).notNull(),
  activeTrials: integer("active_trials").default(0).notNull(),
  totalPayments: integer("total_payments").default(0).notNull(),
  totalRevenue: doublePrecision("total_revenue").default(0).notNull(),
});
