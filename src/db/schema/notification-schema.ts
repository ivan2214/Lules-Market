import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { notificationTypeEnum } from "./enums";

/**
 * ===============================================================
 * NOTIFICATIONS
 * ===============================================================
 */

export const notification = pgTable(
  "notification",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    read: boolean("read").default(false).notNull(),
    userId: text("user_id").notNull(),
    actionUrl: text("action_url"),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    readAt: timestamp("read_at"),
  },
  (table) => [
    index("notification_userId_idx").on(table.userId),
    index("notification_read_idx").on(table.read),
    index("notification_type_idx").on(table.type),
  ],
);

/**
 * ===============================================================
 * RELATIONS
 * ===============================================================
 */

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}));
