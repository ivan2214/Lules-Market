import Elysia, { t } from "elysia";
import { db } from "@/db";
import { log as schemaLog } from "@/db/schema";

export const adminRouter = new Elysia({
  prefix: "/admin",
}).post(
  "/createLog",
  async ({ body }) => {
    try {
      const [newLog] = await db.insert(schemaLog).values(body).returning();
      return { success: true, log: newLog };
    } catch (error) {
      console.error("Error creating log:", error);
      return { success: false, error: "Failed to create log" };
    }
  },
  {
    isAdmin: true,

    body: t.Object({
      action: t.String(),
      id: t.String().optional(),
      timestamp: t.Date().optional(),
      businessId: t.String().optional(),
      entityType: t.String().optional(),
      entityId: t.String().optional(),
      details: t.Object(t.Any()),
      adminId: t.String().optional(),
    }),
  },
);
