import { Elysia } from "elysia";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AppError } from "../errors";

export const authPlugin = new Elysia({ name: "auth-plugin" })
  .macro(({ onBeforeHandle }) => ({
    role(role: "admin" | "user" | "business") {
      onBeforeHandle(async () => {
        const h = await headers();
        const session = await auth.api.getSession({ headers: h });

        if (!session) {
          throw new AppError("Unauthorized", "UNAUTHORIZED");
        }

        const userRole = session.user.role?.split(",") ?? [];
        if (!userRole.includes(role)) {
          throw new AppError("Forbidden", "FORBIDDEN");
        }
      });
    },
  }))
  .derive(async () => {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    return { session };
  });
