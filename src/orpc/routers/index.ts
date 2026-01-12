import type { RouterClient } from "@orpc/server";

import { adminRouter } from "./admin";

import { authRouter } from "./auth";
import { businessPrivateRouter } from "./business/private";
import { businessPublicRouter } from "./business/public";
import { categoryRouter } from "./category";
import { paymentRouter } from "./payment";
import { planRouter } from "./plan";
import { productsPublicRouter } from "./products/public";
import { settingsRouter } from "./settings";
import { userRouter } from "./user";

export const appRouter = {
  auth: authRouter,
  business: {
    public: businessPublicRouter,
    private: businessPrivateRouter,
  },
  admin: adminRouter,
  category: categoryRouter,
  payment: paymentRouter,
  plan: planRouter,
  products: {
    public: productsPublicRouter,
  },
  settings: settingsRouter,
  user: userRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
