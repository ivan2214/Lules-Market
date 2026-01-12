import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { auth } from "@/lib/auth";
import { AppError, errorCodes } from "./errors";
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
  .mount("/auth", auth.handler)
  .get("/health", "OK")
  .use(productsPrivateRouter);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
