const typeCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
export class AppError extends Error {
  constructor(
    public message: string,
    public code: keyof typeof typeCodes,
    public details?: unknown,
    public status?: number,
  ) {
    super(message);
    this.name = "AppError";
    this.status = typeCodes[code];
    this.code = code;
  }
  toResponse() {
    return Response.json(
      { error: this.message, code: this.code, details: this.details },
      { status: this.status },
    );
  }
}
