import { os } from "@orpc/server";

export const base = os
  .$context<{
    request: Request;
  }>()
  .errors({
    RATE_LIMIT: {
      message: "Too many requests",
    },
    BAD_REQUEST: {
      message: "Bad request",
    },
    NOT_FOUND: {
      message: "Not found",
    },
    FORBIDDEN: {
      message: "Forbidden",
    },
    UNAUTHORIZED: {
      message: "No autorizado",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Internal server error",
    },
  });
