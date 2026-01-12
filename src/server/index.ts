import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { AppError, errorCodes } from "./errors";
import { OpenAPI } from "./plugins/auth";
import { productsPrivateRouter } from "./routers/products";

export const app = new Elysia({ prefix: "/api" })
  .error({
    AppError,
  })
  .onError(({ code, error, set }) => {
    if (code === "AppError") {
      set.status = errorCodes[error.code] || 500;
      return {
        success: false,
        message: error.message,
        code: error.code,
        details: error.details,
      };
    }
  })
  .use(
    cors({
      origin: "http://localhost:3001",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .use(productsPrivateRouter);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
