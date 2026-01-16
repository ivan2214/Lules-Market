import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { type Context, Elysia, type ValidationError } from "elysia";
import { auth } from "@/lib/auth";
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
import { uploadRoute } from "./modules/upload";
import { userController } from "./modules/user";
import { mercadopagoWebhook } from "./modules/webhooks/mercadopago";
import { authPlugin, OpenAPI } from "./plugins/auth";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.set.status = 405;
    return {
      success: false,
      message: "Method Not Allowed",
    };
  }
};

export const app = new Elysia({
  prefix: "/api",
  detail: { description: "API" },
  name: "Lules Market API",
  tags: ["Lules Market API"],
})
  .error({
    AppError,
  })
  .onError(({ code, error }) => {
    // 1️⃣ Validation → turn into AppError
    if (code === "VALIDATION") {
      // `error` is a ValidationError from TypeBox
      const messages = (error as ValidationError).all.map(
        ({ summary }) => `${summary}`,
      );
      // you can pick the first, join them, or keep the array
      const appErr = new AppError(
        error.message,
        "BAD_REQUEST",
        messages, // optional extra details
      );
      // Elysia expects a plain object or a Response.
      // We return the object produced by `toResponse()`:
      return appErr.toResponse();
    }

    // 2️⃣ Any other error → fallback to generic AppError
    const generic = new AppError(
      error instanceof Error ? error.message : "Internal Server Error",
      error instanceof AppError ? error.code : "INTERNAL_SERVER_ERROR",
      error instanceof AppError ? error.details : error,
    );
    return generic.toResponse();
  })
  .use(cors())
  .all("/api/auth/*", betterAuthView)
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
  .use(mercadopagoWebhook)
  .use(uploadRoute)
  .use(
    openapi({
      documentation: {
        openapi: "3.1.0",
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  );

export type App = typeof app;

// Create Eden Treaty client for server-side usage if needed
// export const api = treaty<App>(env.NEXT_PUBLIC_APP_URL);
