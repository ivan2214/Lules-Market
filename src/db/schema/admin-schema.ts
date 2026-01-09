import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { permissionEnum } from "./enums";

export const admin = pgTable("admin", {
  userId: text("user_id").notNull().unique().primaryKey(),
  permissions: permissionEnum("permissions").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
export const adminRelations = relations(admin, ({ one }) => ({
  user: one(user, {
    fields: [admin.userId],
    references: [user.id],
  }),
}));
