import { index, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
