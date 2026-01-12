import { Elysia } from "elysia";
import { AppError, errorCodes } from "./errors";
import { productsRouter } from "./routers/products";

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
  .get("/health", "OK")
  .use(productsRouter);

export type App = typeof app;
