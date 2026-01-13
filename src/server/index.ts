import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { env } from "@/env/server";
import { AppError } from "./errors";
import { adminRouter } from "./modules/admin";
import { analyticsModule } from "./modules/analytics";
import { authController } from "./modules/auth";
import { businessModule } from "./modules/business";
import { categoryModule } from "./modules/category";
import { paymentRouter } from "./modules/payment";
import { planModule } from "./modules/plan";
import { productModule } from "./modules/products";
import { settingsRouter } from "./modules/settings";
import { userController } from "./modules/user";
import { mercadopagoWebhook } from "./modules/webhooks/mercadopago";
import { authPlugin } from "./plugins/auth";

export const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: [env.APP_URL],
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
    }),
  )
  .onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.code === "NOT_FOUND" ? 404 : 400;
      return {
        success: false,
        element: null,
        message: error.message,
      };
    }
    console.log({
      error,
    });
    // Handle other errors
    return {
      success: false,
      message: "Internal Server Error",
    };
  })
  .use(authPlugin)
  .use(businessModule)
  .use(productModule)
  .use(authController)
  .use(adminRouter)
  .use(paymentRouter)
  .use(settingsRouter)
  .use(userController)
  .use(categoryModule)
  .use(planModule)
  .use(analyticsModule)
  .use(mercadopagoWebhook);

export type App = typeof app;

// Create Eden Treaty client for server-side usage if needed
// export const api = treaty<App>(env.NEXT_PUBLIC_APP_URL);
