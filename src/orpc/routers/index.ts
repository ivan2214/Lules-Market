import type { RouterClient } from "@orpc/server";
import type { User } from "better-auth";

import { o } from "@/orpc/context";
import { authMiddleware } from "@/orpc/middlewares";
import { adminRouter } from "./admin";
import { analyticsRouter } from "./analytics";
import { businessPrivateRouter } from "./business/private";
import { businessPublicRouter } from "./business/public";
import { categoryRouter } from "./category";
import { paymentRouter } from "./payment";
import { planRouter } from "./plan";
import { productsPrivateRouter } from "./products/private";
import { productsPublicRouter } from "./products/public";
import { settingsRouter } from "./settings";
import { userRouter } from "./user";

export const appRouter = {
  healthCheck: o
    .route({
      method: "GET",
      path: "/health",
      summary: "Health Check",
      description: "Check if the API is running",
      tags: ["System"],
    })
    .handler(() => {
      return "OK";
    }),
  privateData: o
    .route({
      method: "GET",
      path: "/private",
      summary: "Get Private Data",
      description: "Returns private data for authenticated users",
      tags: ["Auth"],
    })
    .use(authMiddleware({ role: "user" }))
    .handler(({ context }) => {
      return {
        message: "This is private",
        user: context?.user as User,
      };
    }),
  business: {
    public: businessPublicRouter,
    private: businessPrivateRouter,
  },
  admin: adminRouter,
  analytics: analyticsRouter,
  category: categoryRouter,
  payment: paymentRouter,
  plan: planRouter,
  products: {
    public: productsPublicRouter,
    private: productsPrivateRouter,
  },
  settings: settingsRouter,
  user: userRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
