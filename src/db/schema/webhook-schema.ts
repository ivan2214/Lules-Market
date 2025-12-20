import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
