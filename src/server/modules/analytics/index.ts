import { Elysia } from "elysia";

import { authPlugin } from "@/server/plugins/auth";

export const analyticsModule = new Elysia().group("/analytics/private", (app) =>
  app.use(authPlugin),
);
