import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { image } from "./image-schema";

export const profile = pgTable("profile", {
  userId: text("user_id").notNull().unique().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
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

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
  avatar: one(image, {
    fields: [profile.userId],
    references: [image.avatarId],
  }),
}));
