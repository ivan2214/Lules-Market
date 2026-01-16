// your custom error (unchanged)
export class AppError extends Error {
  status = 418;
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
  toResponse() {
    return Response.json(
      { error: this.message, code: this.code, details: this.details },
      { status: this.status },
    );
  }
}
