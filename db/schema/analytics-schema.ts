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

export const webhookEvent = pgTable("webhook_event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  requestId: text("request_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  mpId: text("mp_id"),
  payload: json("payload").notNull(),
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const log = pgTable(
  "log",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    businessId: text("business_id"),
    adminId: text("admin_id"),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    details: json("details"),
  },
  (table) => [
    index("log_timestamp_idx").on(table.timestamp),
    index("log_businessId_idx").on(table.businessId),
    index("log_adminId_idx").on(table.adminId),
    index("log_entityType_idx").on(table.entityType),
    index("log_entityId_idx").on(table.entityId),
  ],
);
