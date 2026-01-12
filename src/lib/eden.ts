import { treaty } from "@elysiajs/eden";
import { type App, app } from "@/app/api/[[...slugs]]/route";

// .api to enter /api prefix
export const api =
  // process is defined on server side and build time
  typeof process !== "undefined"
    ? treaty(app).api
    : treaty<App>("localhost:3000").api;
