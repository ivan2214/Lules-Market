export class AppError extends Error {
  constructor(
    public message: string,
    public code:
      | "BAD_REQUEST"
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "INTERNAL_SERVER_ERROR" = "INTERNAL_SERVER_ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
